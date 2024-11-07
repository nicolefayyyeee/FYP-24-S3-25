import React, { useState, useRef } from 'react';
import './Features.css';

const Features = () => {
  const [isMuted, setIsMuted] = useState(true); // State to manage mute status
  const videoRef = useRef(null); // Reference to the video element

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  return (
    <div id="features" className="features-container">
      <div className="text-slider-container">
        <div className="text-content">
          <h1>Discover and Describe</h1>
          <p className="text-description">
            With SeeSay Moments, your child embarks on <strong>an exciting journey to explore the world of image captioning</strong> 
            where they are able to enhance their descriptive skills.
          </p>
          <p className="text-description">
            Through <strong>engaging games</strong>, SeeSay Moments aims to deliver meaningful learning experiences that inspire imagination and build confidence. 
          </p>
          <p className="text-description">
            Join us in turning playtime into a <strong>fun-filled adventure of exploration and expression!</strong>
          </p>
        </div>
        
        <div className="video-container">
          <video
            src={require('../../images/Video.mp4')}
            autoPlay
            loop
            muted={isMuted}
            ref={videoRef}
            className="background-video"
          ></video>
          <button className="mute-button" onClick={toggleMute}>
            {isMuted ? "🔈 Unmute" : "🔇 Mute"}
          </button>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-item red">
          <div className="icon">📸</div>
          <h3>Capture and Cherish Every Moment</h3>
          <p>
            Every photo becomes a fun and educational experience, 
            helping your child develop observation and creativity skills as they build their own gallery.
          </p>
        </div>
        <div className="feature-item green">
          <div className="icon">🎮</div>
          <h3>Fun Learning Through Interactive Games</h3>
          <p>
            Immerse your child in fun educational games like matching pictures to words and reading stories from images!
          </p>
        </div>
        <div className="feature-item blue">
          <div className="icon">🛡️</div>
          <h3>A Safe, Family-Friendly Platform</h3>
          <p>
            Designed with your child’s safety in mind, 
            SeeSay Moments provides a secure space for exploration and creativity.
          </p>
        </div>
        <div className="feature-item pink">
          <div className="icon">✨</div>
          <h3>Personalized Experiences</h3>
          <p>Customize the app to suit your child’s interests! SeeSay Moments adapts to their preferences for a unique and personal experience.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
