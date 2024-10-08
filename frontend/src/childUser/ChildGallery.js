import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ChildGallery.css';

const ChildGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    console.log("Fetching gallery for userId:", userId);  // Check if userId is being fetched
    try {
      const response = await axios.get(`http://localhost:5000/gallery?user_id=${userId}`, {
        withCredentials: true,
      });
      console.log("Gallery data received:", response.data); // Log the received data
      setGallery(response.data.images);
    } catch (error) {
      console.error("Error fetching gallery:", error); // Log the error for debugging
      setError(error.response ? error.response.data.error : 'Failed to load gallery.');
    }
  };

  return (
    <div className="gallery-container">
      <h1>Your Gallery</h1>
      {error && <p className="error">{error}</p>}
      <div className="gallery-grid">
        {gallery.length > 0 ? (
          gallery.map((item, index) => (
            <div key={index} className="gallery-item">
              <img src={item.filepath} alt={`Uploaded ${index}`} className="gallery-image" />
              <p className="gallery-caption">{item.caption}</p>
            </div>
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ChildGallery;
