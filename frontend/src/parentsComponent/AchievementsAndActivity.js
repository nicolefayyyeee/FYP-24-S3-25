import axios from "axios";
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import "./AchievementsAndActivity.css";
import dailyTasks from './dailyTasks';

const AchievementsAndActivity = () => {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [dayFrequency, setDayFrequency] = useState(Array(7).fill(0));
  const [activityProgress, setActivityProgress] = useState(0);
  const [imagesUploadedThisWeek, setImagesUploadedThisWeek] = useState(0);
  const [recentScores, setRecentScores] = useState([]);
  const [highestScore, setHighestScore] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const expectedImages = 5; // Expected images per week
  const parentId = localStorage.getItem('user_id');
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/children?parent_id=${parentId}`
      );
      setChildren(response.data.children);
    } catch (error) {
      setError('Failed to load children profiles.');
    }
  };

  const fetchChildData = async (childId) => {
    setError(null);
    setSelectedChildId(childId);

    // Hardcoded scores for each child ID
    const scores = [
      { score: 85, date: "2024-10-20" },
      { score: 90, date: "2024-10-18" },
      { score: 78, date: "2024-10-15" },
      { score: 88, date: "2024-10-12" },
      { score: 95, date: "2024-10-11" },
    ];

    setRecentScores(scores.slice(0, 5));
    setHighestScore(Math.max(...scores.map((s) => s.score)));
    setAverageScore(
      Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    );

    try {
      const galleryResponse = await axios.get(
        `http://localhost:5000/gallery?user_id=${childId}`,
        {
          withCredentials: true,
        }
      );
      setGallery(galleryResponse.data.images);
    } catch (error) {
      setError('Failed to load child data.');
    }
  };

  useEffect(() => {
    if (gallery.length > 0) {
      processGalleryData(gallery);
    } else if (selectedChildId) {
      setActivityProgress(0);
      setImagesUploadedThisWeek(0);
      setDayFrequency(Array(7).fill(0));
    }
  }, [currentWeek, gallery, selectedChildId]);

  const getWeekDateRange = (weekOffset) => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - currentDayOfWeek + (weekOffset * 7));
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek: firstDayOfWeek, endOfWeek: lastDayOfWeek };
  };

  const processGalleryData = (images) => {
    const { startOfWeek, endOfWeek } = getWeekDateRange(currentWeek);

    const imagesInWeek = images.filter((image) => {
      const date = new Date(image.dateUploaded);
      return date >= startOfWeek && date <= endOfWeek;
    });

    const imagesUploaded = imagesInWeek.length;

    const progressPercentage = expectedImages > 0 ? Math.min(
      Math.round((imagesUploaded / expectedImages) * 100),
      100
    ) : 0;

    setActivityProgress(progressPercentage);
    setImagesUploadedThisWeek(imagesUploaded);

    const frequency = Array(7).fill(0);
    imagesInWeek.forEach((image) => {
      const date = new Date(image.dateUploaded);
      const dayIndex = date.getDay();
      frequency[dayIndex]++;
    });
    setDayFrequency(frequency);
  };

  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (gallery.some((image) => {
      const uploadDate = new Date(image.dateUploaded);
      return uploadDate.toDateString() === currentDate.toDateString();
    })) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const getRandomTaskForPeriod = (period) => {
    const tasks = dailyTasks[period];
    const today = new Date();
    const dateSeed = today.getDate() + today.getMonth() + today.getFullYear();
    const randomIndex = (dateSeed + period.length) % tasks.length;
    return tasks[randomIndex];
  };

  const determinePeriod = (time) => {
    const hours = new Date(time).getHours();
    if (hours >= 6 && hours < 12) return "morning";
    if (hours >= 12 && hours < 18) return "afternoon";
    return "night";
  };

  const getDailyTaskProgress = () => {
    const today = new Date().toDateString();
    
    // Initialize progress for each period
    const taskProgress = {
      morning: { ...getRandomTaskForPeriod("morning"), completed: 0 },
      afternoon: { ...getRandomTaskForPeriod("afternoon"), completed: 0 },
      night: { ...getRandomTaskForPeriod("night"), completed: 0 },
    };

    // Filter images uploaded today
    const imagesToday = gallery.filter((image) => {
      const uploadDate = new Date(image.dateUploaded).toDateString();
      return uploadDate === today;
    });

    // Count images for each period based on today's uploads
    imagesToday.forEach((image) => {
      const period = determinePeriod(image.dateUploaded);
      taskProgress[period].completed++;
    });

    return taskProgress;
  };

  const taskProgress = getDailyTaskProgress();
  const streak = calculateStreak();

  const barData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Images Uploaded per Day",
        data: dayFrequency,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderRadius: 10,
      },
    ],
  };

  const barOptions = {
    animation: {
      duration: 1000,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#ffffff" },
      },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const getStartOfWeek = (weekOffset) => {
    const { startOfWeek } = getWeekDateRange(weekOffset);
    return startOfWeek.toLocaleDateString();
  };

  const handleWeekChange = (direction) => {
    setCurrentWeek((prevWeek) => prevWeek + direction);
  };

  return (
    <div className="activityHome">
      <div className="welcome-header">
        <h2>Your Child's Activity</h2>
        <p>Choose a child's profile to view!</p>
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

      {selectedChildId && (
        <>
          <div className="streak">
            <h3>Current Streak: 🔥 {streak} days</h3>
          </div>

          <div className="task-progress">
            {Object.keys(taskProgress).map((period) => (
              <div key={period} className="task-box">
                <h4>{period.charAt(0).toUpperCase() + period.slice(1)} Task</h4>
                <CircularProgressbar
                  value={(taskProgress[period].completed / taskProgress[period].requiredImages) * 100}
                  text={`${taskProgress[period].completed} / ${taskProgress[period].requiredImages}`}
                  styles={buildStyles({
                    textSize: "14px",
                    pathColor: "#3e98c7",
                    textColor: "#fff",
                  })}
                />
                <p>{taskProgress[period].task}</p>
              </div>
            ))}
          </div>

          <div className="score-container">
            <div className="translucent-score-box">
              <h4>Highest Score</h4>
              <CircularProgressbar
                value={highestScore}
                text={`${highestScore}%`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "rgba(62, 152, 199, 1)",
                  textColor: "#fff",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>
            <div className="translucent-score-box">
              <h4>Average Score</h4>
              <CircularProgressbar
                value={averageScore}
                text={`${averageScore}%`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "rgba(62, 152, 199, 1)",
                  textColor: "#fff",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>
          </div>

          <div className="activity-section">
            <h3>Weekly Activity</h3>
            <div className="week-navigation">
              <button onClick={() => handleWeekChange(-1)}>{"<"}</button>
              <span>Week of {getStartOfWeek(currentWeek)}</span>
              <button onClick={() => handleWeekChange(1)}>{">"}</button>
            </div>
            <Bar data={barData} options={barOptions} />
          </div>

          <div className="activity-section">
            <h3>Recent Uploaded Pictures</h3>
            {error && <p className="error">{error}</p>}
            <div className="pictures-container">
              {gallery.slice(-9).map((item, index) => (
                <div key={index} className="uploaded-picture">
                  <img
                    src={item.filepath}
                    alt={`Uploaded ${index + 1}`}
                    className="uploaded-image"
                  />
                  <p className="upload-date">
                    Uploaded on: {new Date(item.dateUploaded).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AchievementsAndActivity;
