import React from 'react';
import { Link } from 'react-router-dom';
import './ParentHome.css'; // Custom styles for the home page

const ParentHome = () => {
    return (
        <>
           <div className="parentHome">
                <div className="welcome-header">
                    <h2>Welcome, Parent!</h2>
                    <p>Start your child's learning journey with us!</p>
                    <button className="profile-btn">Edit Profile</button>
                </div>
                <div className="options-grid">
                    <div className="option-card red">
                    <Link to="/profile">Create and Manage Child Account</Link>
                    </div>
                    <div className="option-card yellow">
                    <Link to="/moments">View Child's Achievments and Activity</Link>
                    </div>
                    <div className="option-card blue">
                    <Link to="/gallery">View Subscription Plans</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ParentHome;
