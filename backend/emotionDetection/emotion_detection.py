import cv2
import numpy as np
from tensorflow.keras.models import load_model
from flask import Flask, Response, jsonify
from flask_cors import CORS
import time
from collections import Counter

# Load the trained emotion detection model
try:
    model = load_model('emotion_model.h5')
except Exception as e:
    print(f"Error loading model: {e}")
    exit(1)

# Emotion labels and corresponding sentences
class_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
emotion_sentences = {
    "Angry": "You seem upset. Take a deep breath and try to relax.",
    "Disgust": "Something seems unpleasant. Maybe a fresh perspective could help.",
    "Fear": "It's okay to feel scared. You are stronger than you think.",
    "Happy": "You're looking joyful! Keep spreading that positivity.",
    "Sad": "Feeling down? Remember, this too shall pass.",
    "Surprise": "Looks like something unexpected happened!",
    "Neutral": "You seem calm and composed."
}

# Load the face detector
faceDetect = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
if faceDetect.empty():
    print("Error: Haar Cascade file not found")
    exit(1)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize global variables
dominant_emotion = None

def process_face(face_region):
    """Process face region for model prediction."""
    face_region = cv2.resize(face_region, (48, 48)) / 255.0
    face_region = np.reshape(face_region, (1, 48, 48, 1))
    predictions = model.predict(face_region)
    confidence = np.max(predictions)
    emotion = class_labels[np.argmax(predictions)] if confidence > 0.5 else "Uncertain"
    return emotion

@app.route('/video_feed_with_emotion', methods=['GET'])
def video_feed_with_emotion():
    """Stream video and detect emotion for 7 seconds, then return dominant emotion."""
    global dominant_emotion
    dominant_emotion = None  # Reset for each session
    return Response(generate_video_with_emotion(), mimetype='multipart/x-mixed-replace; boundary=frame')

def generate_video_with_emotion():
    """Generate video stream for real-time emotion detection and store dominant emotion after 7 seconds."""
    global dominant_emotion
    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        print("Error: Cannot access the webcam")
        return

    start_time = time.time()
    emotion_counts = []

    try:
        while True:
            elapsed_time = time.time() - start_time
            if elapsed_time > 7:  # Stop capturing after 7 seconds
                print("7 seconds elapsed, stopping video feed.")
                break

            ret, img = cam.read()
            if not ret:
                break

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = faceDetect.detectMultiScale(gray, 1.3, 5)

            for (x, y, w, h) in faces:
                face_region = gray[y:y+h, x:x+w]
                emotion = process_face(face_region)
                emotion_counts.append(emotion)
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(img, f"{emotion}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 127), 2)

            # Encode the frame to JPEG format
            ret, jpeg = cv2.imencode('.jpg', img)
            if not ret:
                break

            # Yield the frame in the response for streaming
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')

        # After video feed ends, calculate the dominant emotion
        if emotion_counts:
            emotion_counter = Counter(emotion_counts)
            dominant_emotion = emotion_counter.most_common(1)[0][0]
            print(f"Detected Emotion after 7 seconds: {dominant_emotion}")

    finally:
        cam.release()

@app.route('/dominant_emotion', methods=['GET'])
def get_dominant_emotion():
    """Return the dominant emotion and corresponding sentence after the video stream."""
    global dominant_emotion
    if dominant_emotion:
        response = {
            "dominant_emotion": dominant_emotion,
            "emotion_sentence": emotion_sentences.get(dominant_emotion, "No description available.")
        }
        return jsonify(response)
    else:
        return jsonify({"error": "No emotion detected"}), 400

@app.route('/')
def home():
    return 'Emotion Detection API is running'

if __name__ == '__main__':
    app.run(debug=True)