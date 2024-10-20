import React from "react";
import { Link } from "react-router-dom";
import { FiCamera, FiImage, FiGlobe } from "react-icons/fi"; // Example icons
import { FaGamepad } from "react-icons/fa";

import "./ChildHome.css"; // Custom styles for the home page

const ChildHome = () => {
  return (
    <>
      <div className="childHome">
        <div className="welcome-header">
          <h2>Welcome, Junior Explorer!</h2>
          <p>Let's capture your world and bring your moments to life!</p>
          <button className="profile-btn">Edit Profile</button>
        </div>
        <div className="options-grid">
          <Link to="/imageCaptioning">
            <div className="option-card red">
            <FiCamera className="option-icon" />
            Snap a Memory
            </div>
          </Link>
          <Link to="/galleryPage">
            <div className="option-card blue">
              <FiImage className="option-icon" />
              My Moments
            </div>
          </Link>
          <Link to="/explorePage">
            <div className="option-card green">
              <FiGlobe className="option-icon" />
              Explore the Gallery
            </div>
          </Link>
          <Link to="/games">
            <div className="option-card pink">
              <FaGamepad className="option-icon" />
              Games
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ChildHome;
