import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ChildGallery.css';

const ChildGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);  // State for showing only favorites
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    console.log("Fetching gallery for userId:", userId);
    try {
      const response = await axios.get(`http://localhost:5000/gallery?user_id=${userId}`, {
        withCredentials: true,
      });
      console.log("Gallery data received:", response.data);
      setGallery(response.data.images);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      setError(error.response ? error.response.data.error : 'Failed to load gallery.');
    }
  };

  // Toggle Favorite Status
  const handleFavorite = async (imageId, isFavorite) => {
    try {
      const response = await axios.post(`http://localhost:5000/favorite`, {
        user_id: userId,
        image_id: imageId,
        is_favorite: !isFavorite,  // Toggle current favorite status
      });
      console.log(response.data.message);
      fetchGallery(); // Refresh gallery after updating favorites
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  // Delete Image with Confirmation
  const handleDelete = async (imageId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/delete/${imageId}`);
      fetchGallery(); // Refresh gallery after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Filter the gallery based on the showFavorites state
  const filteredGallery = showFavorites
    ? gallery.filter((item) => item.is_favorite)
    : gallery;

  const capitalizeFirstLetter = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';


  return (
    <div className="gallery-container">
      <h1 className="gallery-title">My Gallery</h1>
      {error && <p className="error">{error}</p>}

      {/* Buttons for Favourites and View All Photos */}
      <div className="gallery-buttons">
        <button
          className={`btn-fav-photos ${showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(true)}
        >
          My Favourites
        </button>
        <button
          className={`btn-all-photos ${!showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(false)}
        >
          View All Photos
        </button>
      </div>

      <div className="gallery">
        {filteredGallery.length > 0 ? (
          filteredGallery.map((item, index) => (
            <div key={index} className="gallery-item">
              <div className="image-container">
                <img src={item.filepath} alt={`Uploaded ${index}`} className="gallery-image" />
                {/* Favorite and Delete buttons */}
                <div className="gallery-actions">
                  <button
                    className={`favorite-btn ${item.is_favorite ? 'favorited' : ''}`}
                    onClick={() => handleFavorite(item.image_id, item.is_favorite)}
                  >
                    {item.is_favorite ? '❤️' : '🤍'}
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(item.image_id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <p className="gallery-caption">{capitalizeFirstLetter(item.caption)}</p>
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
