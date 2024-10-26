import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ParentHome.css";

const EditChild = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { childUserId } = location.state || {};
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        name: "",
        password: "",
        confirmPassword: "",
        timeLimit: 0,
        gameAccess: true,
        galleryAccess: true
    });
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!childUserId) return;
            try {
                const response = await fetch(`http://localhost:5000/get_user_details/${childUserId}`);
                const data = await response.json();
                setForm({
                    username: data.username,
                    name: data.name,
                    password: "",
                    confirmPassword: "",
                    timeLimit: data.time_limit || 0,
                    gameAccess: data.game_access,
                    galleryAccess: data.gallery_access
                });
            } catch (error) {
                console.error("Error fetching child data:", error);
                setErrorMessage("Failed to load child profile.");
            }
        };
        fetchUserData();
    }, [childUserId]);

    const submit = async () => {
        if (form.username === "" || form.name === "" || form.password === "" || form.confirmPassword === "") {
            setErrorMessage("Please fill in all fields");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }
        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:5000/update_user/${childUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: form.username,
                    name: form.name,
                    password: form.password,
                    time_limit: form.timeLimit,
                    game_access: form.gameAccess,
                    gallery_access: form.galleryAccess
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate("/profile");
            } else {
                setErrorMessage(data.message || "Failed to update profile.");
            }
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="parentHome">
            <div className="parent-welcome-header">
                <h2>Edit Child Profile</h2>
                <p>Fill in the form below to update child profile</p>
                <button className="parent-profile-btn" onClick={() => navigate("/profile")}>
                    Back to Profiles
                </button>
            </div>
            <form className="form-container" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                {errorMessage && <div className="error-msg">{errorMessage}</div>}
                
                <div className="form-field">
                    <label>Username</label><br />
                    <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </div>
                
                <div className="form-field">
                    <label>Name</label><br />
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                
                <div className="form-field">
                    <label>Password</label><br />
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                
                <div className="form-field">
                    <label>Confirm Password</label><br />
                    <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>

                <div className="form-field">
                    <p className="parent-welcome-header">Set Restrictions for your Child</p>
                    <label>Time Limit (hours)</label><br />
                    <input type="number" value={form.timeLimit} onChange={(e) => setForm({ ...form, timeLimit: e.target.value })} />
                </div>

                {/* Toggle button for game access */}
                <div className="form-field">
                    <label>Allow Access to Games</label><br />
                    <label className="toggle-switch">
                        <input type="checkbox" checked={form.gameAccess} onChange={(e) => setForm({ ...form, gameAccess: e.target.checked })} />
                        <span className="slider"></span>
                    </label>
                </div>

                {/* Toggle button for gallery access */}
                <div className="form-field">
                    <label>Allow Access to Explore Page</label><br />
                    <label className="toggle-switch">
                        <input type="checkbox" checked={form.galleryAccess} onChange={(e) => setForm({ ...form, galleryAccess: e.target.checked })} />
                        <span className="slider"></span>
                    </label>
                </div>

                <button className="submit-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default EditChild;
