import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ParentHome.css";

const CreateChild = () => {
    const navigate = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        name: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState('');
    
    const submit = async () => {
        const userId = localStorage.getItem('user_id');
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
            const response = await fetch('http://localhost:5000/add_child', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: form.username,
                    name: form.name,
                    password: form.password,
                    user_id: userId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate("/profile");
              } else {
                setErrorMessage(data.message || "Failed to create profile.");
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
                <h2>Add New Child Profile</h2>
                <p>Fill in the form below to create a new child profile</p>
                <button className="profile-btn" onClick={() => navigate("/profile")}>
                        Back to Profiles
                </button>
            </div>
            <div>
                <form className="form-container" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                {errorMessage && <div className="error-msg">{errorMessage}</div>}
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

export default CreateChild;
