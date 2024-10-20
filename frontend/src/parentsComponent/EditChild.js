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
                });
            } catch (error) {
                console.error("Error fetching child data:", error);
                setErrorMessage("Failed to load child profile.");
            }
        };

        fetchUserData();
    }, [childUserId]);

    const submit = async () => {
        if (form.username === "" || form.name === "" || form.password === "") {
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
            <div className="welcome-header">
                <h2>Edit Child Profile</h2>
                <p>Fill in the form below to update {form.username} profile</p>
                <button className="profile-btn" onClick={() => navigate("/profile")}>
                    Back to Profiles
                </button>
            </div>
            <form className="form-container" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                {errorMessage && <div className="error-msg">{errorMessage}</div>}
                <div className="form-field">
                    <label>Username</label><br />
                    <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                </div>

                <div className="form-field">
                    <label>Name</label><br />
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                <div className="form-field">
                    <label>Password</label><br />
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                </div>

                <div className="form-field">
                    <label>Confirm Password</label><br />
                    <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                </div>

                <button className="submit-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default EditChild;
