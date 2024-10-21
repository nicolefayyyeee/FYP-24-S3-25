import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css"; // Custom styles for the home page

const AdminHome = () => {
  const navigate = useNavigate(); 
  const username = localStorage.getItem('username');

  return (
    <>
      <div className="adminHome">
        <div className="admin-welcome-header">
          <h2>Welcome, {username}!</h2>
          <p>
            Effortlessly manage, oversee and optimize your system - all from one
            powerful dashboard
          </p>
          <button className="admin-profile-btn" onClick={() => navigate("/editAccount")}>Edit Profile</button>
        </div>
        <div className="admin-options-grid">
          <Link to="/manageAccounts">
            <div className="admin-option-card red">Manage User Accounts</div>
          </Link>
          <Link to="/manageUserProfiles">
            <div className="admin-option-card yellow">Manage User Profiles</div>
          </Link>
          <Link to="/gallery">
            <div className="admin-option-card green">View Data Metrics</div>
          </Link>
          <Link to="/adminUpload">
            <div className="admin-option-card blue">Manage System's Photos</div>
          </Link>
          <Link to="/viewAllReviews">
            <div className="admin-option-card purple">View All Reviews</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
