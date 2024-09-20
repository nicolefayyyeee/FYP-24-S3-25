import React from 'react';
import '../about/About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about-content">
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="About Us" />
        </div>
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            SeeSay Moments is an interactive photo app designed for children, blending creativity with learning. Tailored for young explorers, our app allows kids to capture their world through photos, add their own voice to describe their snapshots, and discover new ways to express themselves.
          </p>
          <p>
            Developed as part of our final year project, SeeSay Moments aims to foster creativity, encourage curiosity, and provide a fun, educational experience. By offering a playful and safe space for exploration, we help children learn and grow while celebrating their unique perspectives and moments.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
