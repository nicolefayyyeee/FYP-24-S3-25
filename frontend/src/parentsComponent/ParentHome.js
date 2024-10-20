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
          <h2>Welcome, insert Parent name!</h2>
          <p>Start your child's learning journey with us!</p>
          <button className="profile-btn" onClick={() => navigate("/editAccount")}>Edit Profile</button>
        </div>
        <div className="options-grid">
          <Link to="/createAndManageChild">
            <div className="option-card red">
              Create and Manage Child Account
            </div>
          </Link>
          <Link to="/achievementsAndActivity">
            <div className="option-card blue">
              View Child's Achievements and Activity
            </div>
          </Link>
          <Link to="/subscriptionPlans">
            <div className="option-card pink">View Subscription Plans</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ParentHome;
