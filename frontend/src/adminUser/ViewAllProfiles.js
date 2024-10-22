import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./ViewAll.css";
import "./AdminHome.css";

const ViewAllProfiles = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingRoleId, setEditingRoleId] = useState(null);
    const [editedRoleName, setEditedRoleName] = useState("");
    const inputRef = useRef(null);

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
    const handleSaveRole = async (profileId) => {
        const currentProfile = profiles.find(profile => profile.id === profileId);

        if (currentProfile.role === editedRoleName) {
            setEditingRoleId(null);
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/update_role/${profileId}`, {
                method: "PUT",
                body: JSON.stringify({ role: editedRoleName }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                setProfiles((prevProfiles) =>
                    prevProfiles.map((profile) =>
                        profile.id === profileId ? { ...profile, role: editedRoleName } : profile
                    )
                );
            } else {
                alert(data.message || "Error updating role name");
            }
        } catch (error) {
            console.error("Error updating role name:", error);
        } finally {
            setEditingRoleId(null);
        }
    };

    const handleEditRole = (profileId, roleName) => {
        setEditingRoleId(profileId);
        setEditedRoleName(roleName);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
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
            setProfiles((prevProfiles) =>
                prevProfiles.map((profile) =>
                    profile.id === profileId
                        ? {
                            ...profile,
                            suspended_count: shouldSuspend ? userCount : 0,
                        }
                        : profile
                )
            );

            try {
                const response = await fetch(`http://localhost:5000/suspend_profile/${profileId}`, {
                    method: "PUT",
                    body: JSON.stringify({ suspend: shouldSuspend }),
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                if (response.ok) {
                    setProfiles((prevProfiles) =>
                        prevProfiles.map((profile) =>
                            profile.id === profileId
                                ? {
                                    ...profile,
                                    suspended_count: shouldSuspend ? userCount : 0,
                                }
                                : profile
                        )
                    );
                    alert(`All users ${shouldSuspend ? "suspended" : "unsuspended"} successfully`);
                } else {
                    alert(data.message || "Error updating profile suspend status");
                    setProfiles((prevProfiles) =>
                        prevProfiles.map((profile) =>
                            profile.id === profileId
                                ? {
                                    ...profile,
                                    suspended_count: shouldSuspend ? 0 : suspendedCount,
                                }
                                : profile
                        )
                    );
                }
            } catch (error) {
                console.error("Error updating profile suspend status:", error);
                setProfiles((prevProfiles) =>
                    prevProfiles.map((profile) =>
                        profile.id === profileId ? { ...profile, suspended_count: suspendedCount } : profile
                    )
                );
            }
        }
    };

    const filteredProfiles = profiles.filter((profile) =>
        profile.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            <div className="admin-welcome-header">
                <h2>View All Profiles</h2>
                <p>Click suspend/unsuspend to update the profile status</p>
                <button className="admin-profile-btn" onClick={() => navigate("/manageUserProfiles")}>
                    Back to Manage User Profiles
                </button>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Role Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
                <FaSearch className="search-icon" />
            </div>
            {filteredProfiles.length === 0 ? (
                <p>No profiles found.</p>
            ) : (
                <ul className="user-list">
                    {filteredProfiles.map((profile) => (
                        <li key={profile.id} className="user-card">
                            <div className="user-details">
                                <div className="user-header">
                                    <div className="role-name">
                                        {editingRoleId === profile.id ? (
                                            <form onSubmit={(e) => { e.preventDefault(); handleSaveRole(profile.id); }}>
                                                <p>Role:</p>
                                                <input
                                                    type="text"
                                                    value={editedRoleName}
                                                    onChange={(e) => setEditedRoleName(e.target.value)}
                                                    className="edit-role-input"
                                                    ref={inputRef}
                                                />
                                                <span
                                                    className="save-icon"
                                                    onClick={() => handleSaveRole(profile.id)}
                                                    role="img"
                                                    aria-label="check"
                                                >
                                                    ✔️
                                                </span>
                                            </form>
                                        ) : (
                                            <>
                                                <p>Role: {profile.role}</p>
                                                <span
                                                    className="edit-icon"
                                                    onClick={() => handleEditRole(profile.id, profile.role)}
                                                    role="img"
                                                    aria-label="pencil"
                                                >
                                                    ✏️
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <p>{profile.user_count} Users</p>
                                </div>
                                <div className="profile-body">
                                    <p>ID: {profile.id}</p>
                                    <p style={{ color: "red", fontWeight: "bold" }}>
                                        Suspended Users: {profile.suspended_count}
                                    </p>
                                </div>
                                <div className="button-row">
                                    <button
                                        className="suspend-btn suspend"
                                        onClick={() =>
                                            handleSuspendProfile(
                                                profile.id,
                                                true,
                                                profile.suspended_count,
                                                profile.user_count
                                            )
                                        }
                                    >
                                        Suspend All
                                    </button>
                                    <button
                                        className="suspend-btn unsuspend"
                                        onClick={() =>
                                            handleSuspendProfile(
                                                profile.id,
                                                false,
                                                profile.suspended_count,
                                                profile.user_count
                                            )
                                        }
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
