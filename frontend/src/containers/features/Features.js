import React, { useState, useEffect } from 'react';
import './Features.css';

const Features = () => {
  const slides = [
    { url: "https://images.unsplash.com/photo-1608106055806-e892769d2e5a?q=80&w=2989&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { url: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { url: "https://images.unsplash.com/photo-1458546450666-ebb1e605853f?q=80&w=2992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length]);

  const slideStyles = { backgroundImage: `url(${slides[currentIndex].url})` };

  return (
    <div id="features" className="features-container"> {/* Added id="features" */}
      <div className="text-slider-container">
        <div className="text-content">
          <h1>Discover and Describe</h1>
          <p className="text-description">
            With SeeSay Moments, your child embarks on <strong>an exciting to explore the world of image captioning </strong> 
            where they are able to enhance their descriptive skills.
          </p>
          <p className="text-description">
            Through <strong>engaging games </strong>, SeeSay Moments aims to deliver meaningful learning experiences that inspire imagination and build confidence. 
          </p>
          <p className="text-description">
            Join us in turning playtime into a <strong>fun-filled adventure of exploration and expression!</strong>
          </p>
        </div>
        <div className="slider-container">
          <div className="slider-content">
            <div className="slide" style={slideStyles}></div>
            <div className="left-arrow" onClick={() => setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1)}>❰</div>
            <div className="right-arrow" onClick={() => setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1)}>❱</div>
          </div>
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
              Designed with your child’s safety in mind, SeeSay Moments provides a secure space for exploration and creativity..
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