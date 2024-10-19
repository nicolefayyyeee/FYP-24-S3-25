import React from "react";
import { Link } from "react-router-dom";
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
            <div className="option-card red">Snap a Memory</div>
          </Link>
          <Link to="/galleryPage">
            <div className="option-card yellow">My Moments</div>
          </Link>
          <Link to="/explorePage">
            <div className="option-card green">Explore the Gallery</div>
          </Link>
          <Link to="/games">
            <div className="option-card blue">Games</div>
          </Link>
          <Link to="/creative-corner">
            <div className="option-card purple">Creative Corner</div>
          </Link>
          <Link to="/achievements">
            <div className="option-card pink">My Achievements</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ChildHome;
