import React from "react";
import { Link } from "react-router-dom";

import "./ChildHome.css"; // Custom styles for the home page

const ChildHome = () => {
  const username = localStorage.getItem('username');

  return (
    <>
      <div className="childHome">
        <div className="child-welcome-header">
          <h2>Welcome back, {username}!</h2>
          <p>Let's capture your world and bring your moments to life!</p>
          <button className="child-avatar-btn">Edit Avatar</button>
        </div>
        <div className="child-options-grid">
          <Link to="/imageCaptioning">
            <div className="child-option-card red">
              <div className="child-icon">📸</div> {/* Camera emoji on a separate line */}
              Snap a Memory
            </div>
          </Link>
          <Link to="/galleryPage">
            <div className="child-option-card blue">
              <div className="child-icon">🖼️</div> {/* Framed picture emoji on a separate line */}
              My Moments
            </div>
          </Link>
          <Link to="/explorePage">
            <div className="child-option-card green">
              <div className="child-icon">🌐</div> {/* Globe emoji on a separate line */}
              Explore the Gallery
            </div>
          </Link>
          <Link to="/games">
            <div className="child-option-card pink">
              <div className="child-icon">🎮</div> {/* Video game emoji on a separate line */}
              Games
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ChildHome;
