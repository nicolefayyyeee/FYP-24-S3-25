import React from "react";
import "./AchievementsAndActivity.css"; // Custom styles for the home page

const AchievementsAndActivity = () => {
  // Placeholder data for demonstration
  const childData = {
    scores: [
      { score: 95, date: "2024-10-20" }, // Sample scores with dates
      { score: 88, date: "2024-10-18" },
      { score: 76, date: "2024-10-15" },
    ],
    uploadedPictures: [
      { url: "https://via.placeholder.com/150", date: "2024-10-19" }, // Sample image URLs with dates
      { url: "https://via.placeholder.com/150", date: "2024-10-18" },
      { url: "https://via.placeholder.com/150", date: "2024-10-17" },
      { url: "https://via.placeholder.com/150", date: "2024-10-16" },
      { url: "https://via.placeholder.com/150", date: "2024-10-15" },
      { url: "https://via.placeholder.com/150", date: "2024-10-14" },
      { url: "https://via.placeholder.com/150", date: "2024-10-13" },
      { url: "https://via.placeholder.com/150", date: "2024-10-12" },
      { url: "https://via.placeholder.com/150", date: "2024-10-11" },
      { url: "https://via.placeholder.com/150", date: "2024-10-10" },
      { url: "https://via.placeholder.com/150", date: "2024-10-09" },
      { url: "https://via.placeholder.com/150", date: "2024-10-08" },
    ]
  };

  // Get the last 12 uploaded pictures and sort them if necessary
  const sortedPictures = childData.uploadedPictures.slice(-12).sort((a, b) => new Date(b.date) - new Date(a.date));
  const sortedScores = childData.scores.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort scores by date

  return (
    <div className="activityHome">
      <div className="welcome-header">
        <h2>Your Child's Activity</h2>
        <p>Choose a child's profile to view!</p>
        <div className="button-container">
          <button className="profile-btn">Child 1</button>
          <button className="profile-btn">Child 2</button>
        </div>
      </div>

      {/* New section for game scores - moved to the top */}
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

      {/* New section for uploaded pictures */}
      <div className="activity-section">
        <h3>Uploaded Pictures</h3>
        <div className="pictures-container">
          {sortedPictures.map((item, index) => (
            <div key={index} className="uploaded-picture">
              <img src={item.url} alt={`Uploaded ${index + 1}`} className="uploaded-image" />
              <p className="upload-date">Uploaded on: {new Date(item.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsAndActivity;
