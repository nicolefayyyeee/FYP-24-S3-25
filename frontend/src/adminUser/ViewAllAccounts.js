import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./ViewAll.css";
import "./AdminHome.css";

const ViewAllAccounts = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, suspend: !currentStatus } : user
                )
            );

            try {
                const response = await fetch(`http://localhost:5000/suspend_account/${userId}`, {
                    method: "PUT",
                });
                const data = await response.json();
                if (response.ok) {
                    setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === userId ? { ...user, suspend: data.suspend } : user
                        )
                    );
                    alert(`Suspend status updated successfully`);
                } else {
                    alert(data.message || "Error updating user suspend status");
                    setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === userId ? { ...user, suspend: currentStatus } : user
                        )
                    );
                }
            } catch (error) {
                console.error("Error updating user suspend status:", error);
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? { ...user, suspend: currentStatus } : user
                    )
                );
            }
        }
    };

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="adminHome">
            <div className="admin-welcome-header">
                <h2>View All User Accounts</h2>
                <p>Click the suspend/unsuspend button to update the account status</p>
                <button className="admin-profile-btn" onClick={() => navigate("/manageAccounts")}>
                    Back to Manage User Accounts
                </button>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
                <FaSearch className="search-icon" />
            </div>
            {filteredUsers.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul className="user-list">
                    {filteredUsers.map((user) => (
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