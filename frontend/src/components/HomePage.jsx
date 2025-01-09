import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Import Navbar
import '../styles/HomePage.css';

const HomePage = () => {
  const images = [
    './src/assets/slideshow/1.jpg', // Replace with your image paths
    './src/assets/slideshow/2.webp',
    './src/assets/slideshow/3.webp',
    './src/assets/slideshow/4.jpg',
    './src/assets/slideshow/5.jpeg',
    './src/assets/slideshow/6.avif',
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-page">
      <Navbar /> {/* Add Navbar */}

      <section className="hero">
        <div className="slideshow-container">
          <img
            src={images[currentImage]}
            alt="Slideshow"
            className="slideshow-image"
          />
        </div>
        <h1>Welcome to Solace</h1>
        <p>"I am the voice that listens, the mind that learns, and the bridge connecting your thoughts to infinite possibilities."</p>
        <a href="/chatbot" className="cta-button">Get Started</a>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Emotion Detection System</h3>
            <p>• The system continuously analyzes user inputs (text, voice, or facial expressions) to detect emotions like happiness, sadness, anger, surprise, etc.</p>
            <p>• It uses various methods such as NLP (Natural Language Processing) for text, speech analysis for voice tones, and computer vision for facial expression recognition.</p>
            <p>• Detected emotions are fed back into the conversational AI to adjust responses accordingly, improving the user experience.</p>
          </div>
          <div className="feature-item">
            <h3>Conversational AI (Chatbot)</h3>
            <p>• The AI adjusts its tone, language, and approach based on the detected emotions. For example, if the user is upset, the AI may respond more empathetically and soothingly.</p>
            <p>• The system can maintain context and provide personalized conversations. If a user shows frustration, the AI can escalate the conversation to human support if necessary.</p>
            <p>• Depending on the emotional tone, the AI might recommend different actions, products, or solutions (e.g., calming activities for stress or positive content for happiness).</p>
          </div>
          <div className="feature-item">
            <h3>User Interface & Interaction</h3>
            <p>• An intuitive design that allows users to easily interact with the system via text, voice, or video input. The interface displays the emotional tone detected in real-time, offering transparency and engagement.</p>
            <p>• The UI can dynamically adjust colors, layouts, and animations based on the detected emotion (e.g., calming colors for sadness, vibrant ones for happiness).</p>
            <p>• The system ensures that user emotions are detected and processed ethically, with privacy measures such as anonymization and consent management.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;