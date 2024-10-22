import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

const ManageUserProfiles = () => {
    const navigate = useNavigate(); 
    
    return (
        <>
            <div className="adminHome">
                <div className="admin-welcome-header">
                    <h2>Manage User Profiles</h2>
                    <p>
                        Select an option below to manage user profiles
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center'}}>
                        <button className="admin-profile-btn" onClick={() => navigate("/manageAccounts")}>
                            Manage User Accounts
                        </button>
                        <button className="admin-profile-btn" onClick={() => navigate("/adminHome")}>
                            Back to Home
                        </button>
                    </div>
                </div>
                <div className="admin-options-grid">
                    <Link to="/createProfile">
                        <div className="admin-option-card red">Create User Profile</div>
                    </Link>
                    <Link to="/viewAllProfiles">
                        <div className="admin-option-card yellow">View All Profiles</div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ManageUserProfiles;
