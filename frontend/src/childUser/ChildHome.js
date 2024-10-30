import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "../containers/modal/Modal";
import useModal from "../containers/hooks/useModal";
import "./ChildHome.css"; // Custom styles for the home page

const ChildHome = () => {
  const [gameAccess, setGameAccess] = useState(false); 
  const [galleryAccess, setGalleryAccess] = useState(false);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('user_id'); 
  const navigate = useNavigate();
  const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal(); // modal

  const handleEditAvatar = () => {
    navigate('/avatar'); 
  };

  const logoutUser = useCallback(() => {
    openModal("Time limit is up!", "You have been logged out.", () => {
      localStorage.clear();
        navigate('/login');
    });
  }, [openModal, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get_user_details/${userId}`);
        const data = await response.json();
        if (data) {
          if (data.time_limit !== undefined) {
            const logoutTime = Date.now() + data.time_limit * 3600000;
            localStorage.setItem('logoutTime', logoutTime);
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
    let timer;
    const storedLogoutTime = localStorage.getItem('logoutTime');
    
    if (storedLogoutTime) {
      const remainingTime = storedLogoutTime - Date.now();

      if (remainingTime > 0) {
        timer = setTimeout(() => {
          logoutUser();
        }, remainingTime);
      } else {
        logoutUser();
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [logoutUser]); 

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
      <Modal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        onConfirm={modalAction}
        header={modalHeader} 
        message={modalMessage} 
      />
    </>
  );
};

export default ChildHome;
