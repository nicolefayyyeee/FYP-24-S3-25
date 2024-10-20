import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ParentHome.css"; // Custom styles for the home page

const ParentHome = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="parentHome">
        <div className="welcome-header">
          <h2>Welcome, Parent!</h2>
          <p>Start your child's learning journey with us!</p>
          <button className="profile-btn" onClick={() => navigate("/editAccount")}>Edit Profile</button>
        </div>
        <div className="options-grid">
          <Link to="/profile">
            <div className="option-card red">
              Create and Manage Child Account
            </div>
          </Link>
          <Link to="/moments">
            <div className="option-card yellow">
              View Child's Achievements and Activity
            </div>
          </Link>
          <Link to="/gallery">
            <div className="option-card blue">View Subscription Plans</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ParentHome;
