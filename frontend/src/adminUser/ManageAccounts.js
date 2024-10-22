import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

const ManageAccounts = () => {
    const navigate = useNavigate(); 
    
    return (
        <>
            <div className="adminHome">
                <div className="admin-welcome-header">
                    <h2>Manage User Accounts</h2>
                    <p>
                        Select an option below to manage user accounts
                    </p>                    
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center'}}>
                        <button className="admin-profile-btn" onClick={() => navigate("/manageUserProfiles")}>
                            Manage User Profiles
                        </button>
                        <button className="admin-profile-btn" onClick={() => navigate("/adminHome")}>
                            Back to Home
                        </button>
                    </div>
                </div>
                <div className="admin-options-grid">
                    <Link to="/createAdmin">
                        <div className="admin-option-card red">Create Admin Account</div>
                    </Link>
                    <Link to="/viewAllAccounts">
                        <div className="admin-option-card yellow">View All Accounts</div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ManageAccounts;
