import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";
import "./CreateAdmin.css";

const CreateAdmin = () => {
    const navigate = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState('');
    
    const submit = async () => {
        if (form.username === "" || form.name === "" || form.email === "" || form.password === "" || form.confirmPassword === "") {
            setErrorMessage("Please fill in all fields");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/create_admin', {
                method: 'POST',
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
                // alert("Admin created successfully");
                navigate("/manageAccounts");
            } else {
                setErrorMessage(data.message);
            }

        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="adminHome">
            <div className="admin-welcome-header">
                <h2>Create Admin Account</h2>
                <p>Fill in the form below to create a new admin account</p>
                <button className="admin-profile-btn" onClick={() => navigate("/manageAccounts")}>
                        Back to Manage User Accounts
                </button>
            </div>
            <div>
                <form className="form-container" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                <div className="error-msg">{errorMessage || " "}</div>
                    <div className="form-field">
                        <label>Username</label><br/>
                        <input
                            type="text"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                    </div>

                    <div className="form-field">
                        <label>Name</label><br/>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div className="form-field">
                        <label>Email</label><br/>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="form-field">
                        <label>Password</label><br/>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    <div className="form-field">
                        <label>Confirm Password</label><br/>
                        <input
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        />
                    </div>
                    <button className="submit-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAdmin;
