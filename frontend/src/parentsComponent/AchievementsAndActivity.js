import axios from "axios";
import React, { useEffect, useState } from "react";
import "./AchievementsAndActivity.css"; // Custom styles for the home page

const AchievementsAndActivity = () => {
  const [children, setChildren] = useState([]); // State for child profiles
  const [selectedChildId, setSelectedChildId] = useState(null); // Track selected child ID
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');
  const parentId = localStorage.getItem('user_id'); // Fetch parent user ID from localStorage

  const childData = {
    scores: [
      { score: 95, date: "2024-10-20" }, // Sample scores with dates
      { score: 88, date: "2024-10-18" },
      { score: 76, date: "2024-10-15" },
    ],}

  // Fetch children profiles based on parent_id
  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/children?parent_id=${parentId}`);
      console.log("Children data received:", response.data);
      setChildren(response.data.children);
    } catch (error) {
      console.error("Error fetching children:", error);
      setError('Failed to load children profiles.');
    }
  };

  // Fetch gallery and scores for the selected child
  const fetchChildData = async (childId) => {
    setSelectedChildId(childId); // Set the currently selected child
    try {
      // Fetch gallery for selected child
      const galleryResponse = await axios.get(`http://localhost:5000/gallery?user_id=${childId}`, {
        withCredentials: true,
      });
      console.log("Gallery data for child received:", galleryResponse.data);
      setGallery(galleryResponse.data.images);

    

    } catch (error) {
      console.error("Error fetching child data:", error);
      setError('Failed to load child data.');
    }
  };

  

  // Limit the gallery to the last 9 images and sort them by date
  const sortedGallery = gallery
    .slice(-9) // Take the last 9 images
    .sort((a, b) => new Date(b.dateUploaded) - new Date(a.dateUploaded)); // Sort by date
    // Placeholder for scores (replace with real data if needed)

  const sortedScores = childData.scores.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort scores by date

  

  return (
    <div className="activityHome">
      <div className="welcome-header">
        <h2>Your Child's Activity</h2>
        <p>Choose a child's profile to view!</p>

        {/* Dynamically generate child buttons */}
        <div className="button-container">
          {children.length > 0 ? (
            children.map((child) => (
              <button
                key={child.id}
                className="profile-btn"
                onClick={() => fetchChildData(child.id)}
              >
                {child.name}
              </button>
            ))
          ) : (
            <p>No children profiles found.</p>
          )}
        </div>
      </div>

      {/* Game Scores Section */}
      {/* New section for game scores */}
      <div className="activity-section">
        <h3>Game Scores</h3>
        <ul className="scores-list">
          {sortedScores.map((item, index) => (
            <li key={index}>
              Score {index + 1}: {item.score} - Played on: {new Date(item.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Uploaded Pictures Section */}
      {selectedChildId && (
        <div className="activity-section">
          <h3>Recent uploaded Pictures</h3>
          {error && <p className="error">{error}</p>}
          <div className="pictures-container">
            {sortedGallery.length > 0 ? (
              sortedGallery.map((item, index) => (
                <div key={index} className="uploaded-picture">
                  <img src={item.filepath} alt={`Uploaded ${index + 1}`} className="uploaded-image" />
                  <p className="upload-date">Uploaded on: {new Date(item.dateUploaded).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>No images uploaded yet for this child.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsAndActivity;
