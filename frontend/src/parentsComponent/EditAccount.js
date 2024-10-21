import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ParentHome.css";

const EditAccount = () => {
    const navigate = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState('');
    const userId = localStorage.getItem('user_id');
    const profile = localStorage.getItem('profile');
    const getHomeLink = () => {
        if (profile === 'admin') {
            return '/adminhome';
        } else if (profile === 'parent') {
            return '/parenthome';
        } else if (profile === 'child') {
            return '/childhome';
        } else {
            return '/';
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`http://localhost:5000/get_user_details/${userId}`);
                const data = await response.json();
                setForm({
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    password: "",
                });
            } catch (error) {
                console.error("Error fetching user details:", error);
                setErrorMessage("Failed to load user details.");
            }
        };

        fetchUserData();
    }, [userId]);

    const submit = async () => {
        if (form.username === "" || form.name === "" || form.email === "" || form.password === "") {
            setErrorMessage("Please fill in all fields");
            return;
        }


        if (!validateEmail(form.email)) {
            setErrorMessage("Invalid email format.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:5000/update_user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: form.username,
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate(getHomeLink());
            } else {
                setErrorMessage(data.message || "Failed to update account.");
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
                <h2>My Account</h2>
                <p>Fill in the form below to update your account</p>
                <button className="profile-btn"  onClick={() => navigate(getHomeLink())}>
                    Back to Home
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
                    <label>Email</label><br />
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
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

export default EditAccount;