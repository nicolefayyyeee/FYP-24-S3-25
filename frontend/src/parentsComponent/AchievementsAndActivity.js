import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import "./AchievementsAndActivity.css";

const AchievementsAndActivity = () => {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [dayFrequency, setDayFrequency] = useState(Array(7).fill(0));
  const [imagesUploadedThisWeek, setImagesUploadedThisWeek] = useState(0);
  const [streak, setStreak] = useState(0);
  const [taskProgress, setTaskProgress] = useState({});
  const [uploadCount, setUploadCount] = useState(0);
  const [achievementGoal, setAchievementGoal] = useState(20);
  const [earliestUploadDate, setEarliestUploadDate] = useState(new Date());
  const [uploadsByDate, setUploadsByDate] = useState({});
  const [dailyTasks, setDailyTasks] = useState({});

  const parentId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchChildren();
    fetchDailyTasks();
  }, []);

  const fetchDailyTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/daily_tasks`);
      setDailyTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
      setError('Failed to load daily tasks.');
    }
  };
  
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

    try {
      const galleryResponse = await axios.get(
        `http://localhost:5000/gallery?user_id=${childId}`,
        {
          withCredentials: true,
        }
      );
      const images = galleryResponse.data.images;
      setGallery(images);

      // Count uploads by date
      const uploadsByDateData = images.reduce((acc, image) => {
        const date = new Date(image.dateUploaded).toISOString().split('T')[0]; // Format as YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      setUploadsByDate(uploadsByDateData);

      // Find the earliest date in the upload history
      const earliestDate = images.length > 0 
          ? new Date(Math.min(...images.map(img => new Date(img.dateUploaded)))) 
          : new Date();
      setEarliestUploadDate(earliestDate);

      const computedStreak = calculateStreak(images);
      setStreak(computedStreak);

      const computedTaskProgress = getDailyTaskProgress(images);
      setTaskProgress(computedTaskProgress);

      const totalUploads = images.length;
      setUploadCount(totalUploads);
      setAchievementGoal(calculateAchievementGoal(totalUploads));

    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Failed to load child data.');
    }
  };

  useEffect(() => {
    if (gallery.length > 0) {
      processGalleryData(gallery);
    } else if (selectedChildId) {
      setImagesUploadedThisWeek(0);
      setDayFrequency(Array(7).fill(0));
    }
  }, [currentWeek, gallery, selectedChildId]);

  const processGalleryData = (images) => {
    const { startOfWeek, endOfWeek } = getWeekDateRange(currentWeek);

    const imagesInWeek = images.filter((image) => {
      const date = new Date(image.dateUploaded);
      return date >= startOfWeek && date <= endOfWeek;
    });

    const frequency = Array(7).fill(0);
    imagesInWeek.forEach((image) => {
      const date = new Date(image.dateUploaded);
      const dayIndex = date.getDay();
      frequency[dayIndex]++;
    });
    setDayFrequency(frequency);
  };

  const calculateStreak = (gallery) => {
    if (gallery.length === 0) return 0;

    // Sort the gallery by dateUploaded in descending order
    const sortedGallery = [...gallery].sort((a, b) => new Date(b.dateUploaded) - new Date(a.dateUploaded));
    let streak = 0;
    let currentDate = new Date();

    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      const uploadedToday = gallery.some((image) => {
        const uploadDate = new Date(image.dateUploaded).toISOString().split('T')[0];
        return uploadDate === dateString;
      });

      if (uploadedToday) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateAchievementGoal = (uploadCount) => {
    if (uploadCount < 20) return 20;
    if (uploadCount < 50) return 50;
    if (uploadCount < 80) return 80;
    if (uploadCount < 110) return 110;
    return 150;
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
    if (hours >= 0 && hours < 12) return "morning";
    if (hours >= 12 && hours < 18) return "afternoon";
    return "night";
  };

  const getDailyTaskProgress = (gallery) => {
    const today = new Date().toDateString();

    const taskProgress = {
      morning: { ...getRandomTaskForPeriod("morning"), completed: 0 },
      afternoon: { ...getRandomTaskForPeriod("afternoon"), completed: 0 },
      night: { ...getRandomTaskForPeriod("night"), completed: 0 },
    };

    const imagesToday = gallery.filter((image) => {
      const uploadDate = new Date(image.dateUploaded).toDateString();
      return uploadDate === today;
    });

    imagesToday.forEach((image) => {
      const period = determinePeriod(image.dateUploaded);
      
      // Increment completed count for the corresponding period up to the required limit
      if (taskProgress[period].completed < taskProgress[period].requiredImages) {
        taskProgress[period].completed++;
      }
    });

    return taskProgress;
  };

  const badgeEmoji = uploadCount >= 110 ? '🏆' : uploadCount >= 80 ? '🥇' : uploadCount >= 50 ? '🥈' : uploadCount >= 20 ? '🥉' : '✨';

  const barData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
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
          <div className="achievement-container">
            <div className="streak-box">
              <span className="streak-emoji">🔥</span>
              <p className="streak-label">Streak</p>
              <p className="streak-text">{streak} days</p>
            </div>
            <div className="achievement-box">
              <CircularProgressbar
                value={(uploadCount / achievementGoal) * 100}
                text={badgeEmoji}
                styles={buildStyles({
                  textSize: "45px",
                  textColor: "#000",
                  pathColor: "#B06B30",
                  trailColor: "#e6e6e6",
                })}
              />
              <p className="achievement-label">Achievement</p>
              <p className="achievement-text">{uploadCount} of {achievementGoal} images</p>
            </div>
          </div>

          <div className="task-progress">
            {Object.keys(taskProgress).map((period) => {
              let pathColor;
              if (period === "morning") pathColor = "#FFD580";
              else if (period === "afternoon") pathColor = "#FF8A80";
              else if (period === "night") pathColor = "#9C9EFE";

              const progressPercentage = Math.round((taskProgress[period].completed / taskProgress[period].requiredImages) * 100);

              return (
                <div key={period} className="task-box">
                  <h4>{period.charAt(0).toUpperCase() + period.slice(1)} Task</h4>
                  <div className="circular-container">
                    <CircularProgressbar
                      value={progressPercentage}
                      text={`${progressPercentage}%`}
                      styles={buildStyles({
                        textSize: "20px",
                        textColor: "#ffffff",
                        pathColor: pathColor,
                      })}
                    />
                    <span
                      className="custom-progress-text"
                      style={{ backgroundColor: pathColor }}
                    >
                      {`${taskProgress[period].completed} of ${taskProgress[period].requiredImages} tasks completed`}
                    </span>
                  </div>
                  <p className="task-description">{taskProgress[period].task}</p>
                </div>
              );
            })}
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
              {gallery
                .slice(-9)
                .sort((a, b) => new Date(b.dateUploaded) - new Date(a.dateUploaded))
                .map((item, index) => (
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
