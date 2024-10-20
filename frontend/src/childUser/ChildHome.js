import React from "react";
import { Link } from "react-router-dom";

import "./ChildHome.css"; // Custom styles for the home page

const ChildHome = () => {
  return (
    <>
      <div className="childHome">
        <div className="welcome-header">
          <h2>Welcome, insert childname here!</h2>
          <p>Let's capture your world and bring your moments to life!</p>
          <button className="profile-btn">Edit Profile</button>
        </div>
        <div className="options-grid">
          <Link to="/imageCaptioning">
            <div className="option-card red">
              <div className="icon">📸</div> {/* Camera emoji on a separate line */}
              Snap a Memory
            </div>
          </Link>
          <Link to="/galleryPage">
            <div className="option-card blue">
              <div className="icon">🖼️</div> {/* Framed picture emoji on a separate line */}
              My Moments
            </div>
          </Link>
          <Link to="/explorePage">
            <div className="option-card green">
              <div className="icon">🌐</div> {/* Globe emoji on a separate line */}
              Explore the Gallery
            </div>
          </Link>
          <Link to="/games">
            <div className="option-card pink">
              <div className="icon">🎮</div> {/* Video game emoji on a separate line */}
              Games
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ChildHome;
