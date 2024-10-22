import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // To navigate to caption generator
import './ExplorePage.css';  // Import the CSS file

const ExplorePage = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();  // Initialize navigation

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
    </div>
  );
};

export default ExplorePage;
