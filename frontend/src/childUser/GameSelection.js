import React, { useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "../containers/modal/Modal";
import useModal from "../containers/hooks/useModal";
import "./GameSelection.css"; // Make sure this points to the correct CSS

const GameSelection = () => {
  const navigate = useNavigate();
  const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal(); // modal

  // for time limit
  const logoutUser = useCallback(() => {
    openModal("Time limit is up!", "You have been logged out.", () => {
      localStorage.clear();
      setTimeout(() => {
        navigate('/login');
      }, 100); 
    });
  }, [openModal, navigate]);

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
    <div className="game-selection-container">
      <h1 className="game-selection-header">Choose a Game</h1>
      <div className="game-options">
        <div className="game-option pink-purple">
          <Link to="/match-picture">
            <h1>🧩</h1>
            <h2>Match the Picture</h2>
            <p>Test your memory by matching the pictures!</p>
          </Link>
        </div>
        <div className="game-option dark-blue">
          <Link to="/storytelling-game">
            <h1>📖</h1>
            <h2>Storytelling</h2>
            <p>Dive into amazing stories!</p>
          </Link>
        </div>
      </div>
      <Modal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        onConfirm={modalAction}
        header={modalHeader} 
        message={modalMessage} 
      />
    </div>
  );
};

export default GameSelection;
