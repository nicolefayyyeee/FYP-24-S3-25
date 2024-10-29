import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ParentHome.css";

const CreateChild = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        name: "",
        password: "",
        confirmPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Extract query parameters from the URL
    const params = new URLSearchParams(location.search);
    const planName = params.get("plan");
    const maxProfiles = parseInt(params.get("maxProfiles"), 10);

    // Initialize profile count on component mount
    useEffect(() => {
        // Reset count to 0 when entering this page
        localStorage.setItem('created_profiles', '0'); 
    }, []);

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
    
        // Extract the current plan and its max profile count
        const planName = new URLSearchParams(location.search).get("plan");
        const maxProfiles = parseInt(location.search.split('maxProfiles=')[1], 10);
    
        // Get the current profile count from localStorage for the selected plan
        const createdProfiles = parseInt(localStorage.getItem(`profilesCreated_${planName}`) || '0', 10);
    
        if (createdProfiles >= maxProfiles) {
            alert("You have reached your profile limit."); 
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
                // Increment the profile count in localStorage for the specific plan
                localStorage.setItem(`profilesCreated_${planName}`, createdProfiles + 1);
                alert(data.message);
    
                // Check if reached the limit after increment
                if (createdProfiles + 1 === maxProfiles) {
                    navigate("/profile"); // Direct to profile if at limit
                }
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
            <div className="parent-welcome-header">
                <h2>Add New Child Profile</h2>
                <p>Fill in the form below to create a new child profile</p>
                <p>You have created {localStorage.getItem('created_profiles')} out of {maxProfiles} profiles under the {planName} plan.</p> {/* Inform user of limits */}
                <button className="parent-profile-btn" onClick={() => navigate("/profile")}>
                    Back to Profiles
                </button>
            </div>
            <div>
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
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateChild;
