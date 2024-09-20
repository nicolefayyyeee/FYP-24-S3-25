import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="About Us" />
        </div>
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            SeeSay Moments is an interactive photo app designed for children, blending creativity with learning. Tailored for young explorers, our app allows kids to capture their world through photos, add their own voice to describe their snapshots, and discover new ways to express themselves.
          </p>
        </div>
      </div>

      <div className="about-gallery">
        <div className="gallery-item">
          <img src="https://images.unsplash.com/photo-1527863280617-15596f92e5c8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Children capturing moments" />
          <p>
            Kids capturing their favorite moments with creativity and curiosity.
          </p>
        </div>

        <div className="gallery-item">
          <img src="https://images.unsplash.com/photo-1526399574994-8b0de82950d7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Exploring creativity" />
          <p>
            Exploring new ways to express themselves and share their stories through photos.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
