import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // To navigate to caption generator
import Modal from "../containers/modal/Modal";
import useModal from "../containers/hooks/useModal";
import './ExplorePage.css';  // Import the CSS file

const ExplorePage = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();  // Initialize navigation
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

  // Fetch the gallery images
  const fetchGallery = async () => {
    const response = await axios.get('http://localhost:5000/explorePage');
    setImages(response.data.images);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Redirect to the image caption generator page with selected image
  const handleGenerateCaption = (image) => {
    navigate(`/imageCaptioning`, { state: { selectedImage: image.filepath } });  // Pass the selected image
  };

  return (
    <div className="explore-page">
      <h2 className="explore-title">Explore Beautiful Images</h2>
      <div className="gallery">
        {images.map((image) => (
          <div className="gallery-item" key={image.id}>
            <img 
              src={image.filepath} 
              alt="" 
              className="gallery-image"
            />
            {/* Caption Generator Button - Appears on hover */}
            <div className="overlay">
              <button className="generate-caption-btn" onClick={() => handleGenerateCaption(image)}>
                Generate Caption
              </button>
            </div>
          </div>
        ))}
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

export default ExplorePage;
