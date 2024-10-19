import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewAll.css";
import "./AdminHome.css";

const ViewAllProfiles = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState(null);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/view_all_profiles");
            const data = await response.json();
            if (response.ok) {
                setProfiles(data.profiles);
            } else {
                setError("Error fetching profiles");
            }
        } catch (error) {
            setError("Error fetching profiles");
        } finally {
            setLoading(false);
        }
    };

    const handleSuspendProfile = async (profileId, shouldSuspend, suspendedCount, userCount) => {
        if (shouldSuspend && suspendedCount === userCount) {
            alert("All users in this profile are already suspended.");
            return;
        } else if (!shouldSuspend && suspendedCount === 0) {
            alert("No users in this profile are suspended.");
            return;
        }

        const confirmation = window.confirm(
            `Are you sure you want to ${shouldSuspend ? "suspend" : "unsuspend"} all users in this profile?`
        );
        if (confirmation) {
            try {
                const response = await fetch(`http://localhost:5000/suspend_profile/${profileId}`, {
                    method: "PUT",
                    body: JSON.stringify({ suspend: shouldSuspend }),
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                if (response.ok) {
                    fetchProfiles();
                    alert(`All users ${shouldSuspend ? "suspended" : "unsuspended"} successfully`);
                } else {
                    alert(data.message || "Error updating profile suspend status");
                }
            } catch (error) {
                console.error("Error updating profile suspend status:", error);
            }
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="adminHome">
            <div className="welcome-header">
                <h2>View All Profiles</h2>
                <p>Click suspend/unsuspend to update the profile status</p>
                <button className="profile-btn" onClick={() => navigate("/manageUserProfiles")}>
                    Back to Manage User Profiles
                </button>
            </div>
            {profiles.length === 0 ? (
                <p>No profiles found.</p>
            ) : (
                <ul className="user-list">
                    {profiles.map((profile) => (
                        <li key={profile.id} className="user-card">
                            <div className="user-details">
                                <div className="user-header">
                                    <p>Role: {profile.role}</p>
                                    <p>{profile.user_count} Users</p>
                                </div>
                                <div className="profile-body">
                                    <p>ID: {profile.id}</p>
                                    <p style={{color: "red", fontWeight: "bold"}}>Suspended Users: {profile.suspended_count}</p>
                                </div>
                                <div className="button-row">
                                    <button
                                        className="suspend-btn suspend"
                                        onClick={() => handleSuspendProfile(profile.id, true, profile.suspended_count, profile.user_count)}
                                    >
                                        Suspend All
                                    </button>
                                    <button
                                        className="suspend-btn unsuspend"
                                        onClick={() => handleSuspendProfile(profile.id, false, profile.suspended_count, profile.user_count)}
                                    >
                                        Unsuspend All
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewAllProfiles;
