import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./ChildHome.css"; // Custom styles for the home page

const ChildHome = () => {
  const [timeLimit, setTimeLimit] = useState(0); 
  const [gameAccess, setGameAccess] = useState(false); 
  const [galleryAccess, setGalleryAccess] = useState(false);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('user_id'); 
  const navigate = useNavigate();
  const handleEditAvatar = () => {
    navigate('/avatar'); 
  };

  const logoutUser = () => {
    localStorage.clear();
    navigate('/login'); 
    setTimeout(() => {
      alert("Time limit is up! You have been logged out."); 
    }, 100); 
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get_user_details/${userId}`);
        const data = await response.json();
        if (data) {
          if (data.time_limit !== undefined) {
            setTimeLimit(data.time_limit);
          }
          if (data.game_access !== undefined) {
            setGameAccess(data.game_access);
          }
          if (data.gallery_access !== undefined) {
            setGalleryAccess(data.gallery_access);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    // time limit logic not done yet
    let timer; 
    if (timeLimit > 0) {
      const logoutTime = Date.now() + timeLimit * 1000; // in seconds for how, 3600000 = hours
      timer = setInterval(() => {
        if (Date.now() >= logoutTime) {
          logoutUser(); 
          clearInterval(timer); 
        }
      }, 1000);
    }
    return () => {
      clearInterval(timer); 
    };
  }, [timeLimit]);

  return (
    <>
      <div className="childHome">
        <div className="child-welcome-header">
          <h2>Welcome back, {username}!</h2>
          <p>Let's capture your world and bring your moments to life!</p>
          <button className="child-avatar-btn" onClick={handleEditAvatar}>
            Edit Avatar
          </button>        
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
          {galleryAccess && (
            <Link to="/explorePage">
              <div className="child-option-card green">
                <div className="child-icon">🌐</div> {/* Globe emoji on a separate line */}
                Explore the Gallery
              </div>
            </Link>
          )}
          {gameAccess && (
            <Link to="/games">
              <div className="child-option-card pink">
                <div className="child-icon">🎮</div> {/* Video game emoji on a separate line */}
                Games
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ChildHome;
