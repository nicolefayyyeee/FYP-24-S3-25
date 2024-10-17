import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewAll.css";
import "./AdminHome.css";

const ViewAllAccounts = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/view_all_users");
            const data = await response.json();
            if (response.ok) {
                setUsers(data.users);
            } else {
                alert("Error fetching users");
            }
        } catch (error) {
            alert("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    const handleSuspendToggle = async (userId, currentStatus) => {
        const confirmation = window.confirm(
            `Are you sure you want to ${currentStatus ? "unsuspend" : "suspend"} this user?`
        );

        if (confirmation) {
            try {
                const response = await fetch(`http://localhost:5000/suspend_account/${userId}`, {
                    method: "PUT",
                });
                const data = await response.json();
                if (response.ok) {
                    fetchUsers();
                } else {
                    alert(data.message || "Error updating user suspend status");
                }
                
            } catch (error) {
                console.error("Error updating user suspend status:", error);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="adminHome">
            <div className="welcome-header">
                <h2>View All User Accounts</h2>
                <p>Click the suspend/unsuspend button to update the account status</p>
                <button className="profile-btn" onClick={() => navigate("/manageAccounts")}>
                    Back to Manage User Accounts
                </button>
            </div>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul className="user-list">
                    {users.map((user) => (
                        <li key={user.id} className="user-card">
                            <div className="user-details">
                                <div className="user-header">
                                    <p>Username: {user.username}</p>
                                    <p className={`${user.suspend ? "suspended" : "active"}`}>
                                    {user.suspend ? "Suspended" : "Active"}
                                    </p>
                                </div>
                                <p><strong>ID:</strong> {user.id}</p>
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email || "N/A"}</p>
                                <p><strong>Parent ID:</strong> {user.parent_id || "N/A"}</p>
                                <button
                                    className={`suspend-btn ${user.suspend ? "unsuspend" : "suspend"}`}
                                    onClick={() => handleSuspendToggle(user.id, user.suspend)}
                                >
                                    {user.suspend ? "Unsuspend" : "Suspend"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewAllAccounts;
