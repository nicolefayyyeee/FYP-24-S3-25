import React from 'react';
import { Link } from 'react-router-dom';
import './AdminHome.css'; // Custom styles for the home page

const AdminHome = () => {
    return (
        <>
           <div className="adminHome">
                <div className="welcome-header">
                    <h2>Welcome, Admin!</h2>
                    <p>Effortlessly manage, oversee and optimize your system - all from one powerful dashboard</p>
                    <button className="profile-btn">Edit Profile</button>
                </div>
                <div className="options-grid">
                    <div className="option-card red">
                    <Link to="/snap">Manage User Accounts</Link>
                    </div>
                    <div className="option-card yellow">
                    <Link to="/moments">Manage User Profiles</Link>
                    </div>
                    <div className="option-card green">
                    <Link to="/gallery">View Data Metrics</Link>
                    </div>
                    <div className="option-card blue">
                    <Link to="/games">Manage System's Photos</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminHome;
