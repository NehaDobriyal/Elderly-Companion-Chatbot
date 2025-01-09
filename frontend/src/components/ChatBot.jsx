import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Chatbot.css';

function Chatbot() {
    const [videoFeedUrl, setVideoFeedUrl] = useState(null);
    const [dominantEmotion, setDominantEmotion] = useState(null);
    const [emotionSentence, setEmotionSentence] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Emotion-to-prompt map
    const emotionPrompts = {
        Happy: "I'm feeling really happy today! Everything just seems to be going well. I'm excited to share my joy with you!",
        Sad: "I'm feeling a bit down right now. Things aren't going the way I'd hoped. I could really use someone to talk to.",
        Angry: "I’m feeling really frustrated at the moment. Something's been bothering me and I just need to let it out.",
        Surprised: "Wow, I didn’t expect that! I'm really surprised by what just happened. I can't believe it!",
        Neutral: "I’m feeling pretty neutral right now. Everything seems calm, and I don’t know what to focus on.",
        Uncertain: "I'm not really sure how I’m feeling. There are so many mixed emotions right now, and I can't quite place them."
    };

    const handleStartVideo = () => {
        const uniqueUrl = `http://127.0.0.1:5000/video_feed_with_emotion?timestamp=${new Date().getTime()}`;
        setVideoFeedUrl(null); // Clear the current video feed
        setDominantEmotion(null); // Clear the previous dominant emotion
        setEmotionSentence(null); // Clear the previous sentence
        setLoading(true);
        setTimeout(() => {
            setVideoFeedUrl(uniqueUrl); // Reassign with a unique URL
            pollDominantEmotion(); // Start polling for the dominant emotion
        }, 100); // Short delay to ensure the reset is applied
    };

    const pollDominantEmotion = async () => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/dominant_emotion');
                if (response.ok) {
                    const data = await response.json();
                    setDominantEmotion(data.dominant_emotion);
                    setEmotionSentence(data.emotion_sentence);
                    setLoading(false); // Hide the loading state once processing is done

                    // Stop polling once the emotion is retrieved
                    clearInterval(interval);

                    // Navigate to Solace with the appropriate prompt
                    if (data.dominant_emotion) {
                        const prompt = emotionPrompts[data.dominant_emotion] || emotionPrompts['Uncertain'];
                        setTimeout(() => {
                            navigate('/solace', { state: { prompt } });
                        }, 3000);  // Allow a small delay before navigation
                    }
                }
            } catch (error) {
                console.error("Error fetching dominant emotion:", error);
            }
        }, 1000); // Poll every second
    };

    return (
        <div className="chatbot-page">
            <div className="content">
                <div className="media-screen">
                    {videoFeedUrl ? (
                        <img
                            src={videoFeedUrl}
                            alt="Processed video feed"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    ) : (
                        <p className="placeholder-text">Click the button to start the video feed.</p>
                    )}
                </div>
                <p className="info-text">
                    The video feed is processed by the backend. Rectangles and emotion labels appear around detected faces.
                </p>
                <button className="start-video-button" onClick={handleStartVideo} disabled={loading}>
                    {loading ? 'Processing...' : 'Detect Emotion'}
                </button>

                {dominantEmotion && (
                    <div className="emotion-result">
                        <h2>Detected Emotion: {dominantEmotion}</h2>
                        <p className="emotion-sentence">{emotionSentence}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chatbot;
