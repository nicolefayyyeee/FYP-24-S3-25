import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";
import "./CreateAdmin.css";

const CreateProfile = () => {
    const navigate = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        role: "",
    });
    const [errorMessage, setErrorMessage] = useState('');
    
    const submit = async () => {
        if (form.role === "") {
            setErrorMessage("Please fill in all fields");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/create_profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: form.role,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate("/manageUserProfiles");
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
                <h2>Create User Profile</h2>
                <p>Fill in the form below to create a new user profile</p>
                <button className="admin-profile-btn" onClick={() => navigate("/manageUserProfiles")}>
                        Back to Manage User Profiles
                </button>
            </div>
            <div>
                <form className="form-container" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                {errorMessage && <div className="error-msg">{errorMessage}</div>}
                    <div className="form-field">
                        <label>Role Name</label><br/>
                        <input
                            type="text"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
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

export default CreateProfile;
