import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExplorePage.css';  // Import the CSS file

const ExplorePage = () => {
  const [images, setImages] = useState([]);

  // Fetch the gallery images
  const fetchGallery = async () => {
    const response = await axios.get('http://localhost:5000/explorePage');
    setImages(response.data.images);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
