import React from "react";
import { Link } from "react-router-dom";
import "./AdminHome.css"; // Custom styles for the home page

const AdminHome = () => {
  return (
    <>
      <div className="adminHome">
        <div className="welcome-header">
          <h2>Welcome, Admin!</h2>
          <p>
            Effortlessly manage, oversee and optimize your system - all from one
            powerful dashboard
          </p>
          <button className="profile-btn">Edit Profile</button>
        </div>
        <div className="options-grid">
          <Link to="/snap">
            <div className="option-card red">Manage User Accounts</div>
          </Link>
          <Link to="/moments">
            <div className="option-card yellow">Manage User Profiles</div>
          </Link>
          <Link to="/gallery">
            <div className="option-card green">View Data Metrics</div>
          </Link>
          <Link to="/games">
            <div className="option-card blue">Manage System's Photos</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
