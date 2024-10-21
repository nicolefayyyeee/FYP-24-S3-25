import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ParentHome.css"; // Custom styles for the home page

const ParentHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  
  return (
    <>
      <div className="parentHome">
        <div className="parent-welcome-header">
          <h2>Welcome, {username}!</h2>
          <p>Start your child's learning journey with us!</p>
          <button className="profile-btn" onClick={() => navigate("/editAccount")}>Edit Profile</button>
        </div>
        <div className="parent-options-grid">
          <Link to="/createAndManageChild">
            <div className="parent-option-card red">
              Create and Manage Child Account
            </div>
          </Link>
          <Link to="/achievementsAndActivity">
            <div className="parent-option-card yellow">
              View Child's Achievements and Activity
            </div>
          </Link>
          <Link to="/addReview">
            <div className="parent-option-card green">Leave a Review</div>
          </Link>
          <Link to="/myReviews">
            <div className="parent-option-card blue">View My Reviews</div>
          </Link>
          <Link to="/subscriptionPlans">
            <div className="parent-option-card purple">View Subscription Plans</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ParentHome;
