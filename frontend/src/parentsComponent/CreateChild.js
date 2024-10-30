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
    const [hasReachedLimit, setHasReachedLimit] = useState(false);
    const [createdProfiles, setCreatedProfiles] = useState(0);

    // Extract query parameters from the URL
    const params = new URLSearchParams(location.search);
    const planName = params.get("plan");
    const maxProfiles = parseInt(params.get("maxProfiles"), 10);

    const userId = localStorage.getItem('user_id'); // Get the current logged-in user

    // State to track whether the free plan has been used (fetched from backend on login)
    const [hasUsedFreePlan, setHasUsedFreePlan] = useState(false);

    // Fetch the user's Free plan status from the backend
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/${userId}`);
                const data = await response.json();
                setHasUsedFreePlan(data.used_free_plan); // Fetch and set free plan status
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (userId) {
            fetchUserDetails(); // Fetch user details when the component mounts
        }
    }, [userId]);

    // Initialize profile count and free plan usage status on component mount
    useEffect(() => {
        if (planName !== "Free") {
            // For Basic, Pro, and Premium plans, reset the profile count to 0 every time
            localStorage.setItem(`profilesCreated_${userId}_${planName}`, '0');
            setCreatedProfiles(0);
        } else {
            // Fetch created profiles from localStorage for Free plan
            const createdProfiles = parseInt(localStorage.getItem(`profilesCreated_${userId}_${planName}`) || '0', 10);
            setCreatedProfiles(createdProfiles);

            // Check if the user has reached the profile limit
            if (createdProfiles >= maxProfiles) {
                setHasReachedLimit(true);
                alert(`You have reached the maximum number of profiles for the ${planName} plan.`);
            }
        }
    }, [userId, planName, maxProfiles]);

    const submit = async () => {
        if (!userId) {
            alert("User ID is missing. Please log in again.");
            return;
        }

        if (form.username === "" || form.name === "" || form.password === "") {
            setErrorMessage("Please fill in all fields");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        // Get the current profile count for the logged-in user
        const currentCreatedProfiles = parseInt(localStorage.getItem(`profilesCreated_${userId}_${planName}`) || '0', 10);

        if (planName === "Free" && hasUsedFreePlan) {
            alert("You have already used the Free plan and cannot create more profiles.");
            return;
        }

        if (currentCreatedProfiles >= maxProfiles) {
            alert(`You have reached the maximum number of profiles for the ${planName} plan.`);
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
                // Increment the profile count for the specific user and plan
                const updatedProfileCount = currentCreatedProfiles + 1;
                localStorage.setItem(`profilesCreated_${userId}_${planName}`, updatedProfileCount);
                setCreatedProfiles(updatedProfileCount);
                alert(data.message);

                // If using the Free plan, mark it as used on backend
                if (planName === "Free") {
                    await fetch("http://localhost:5000/user/useFreePlan", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId }),
                    });
                    setHasUsedFreePlan(true);
                }

                // Check if reached the limit after increment
                if (updatedProfileCount >= maxProfiles) {
                    setHasReachedLimit(true);
                    alert(`You have reached the maximum number of profiles for the ${planName} plan.`);
                    navigate("/profile");
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
                <p>
                    You have created {createdProfiles} out of {maxProfiles} profiles under the {planName} plan.
                </p>
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
                            disabled={hasReachedLimit}
                        />
                    </div>

                    <div className="form-field">
                        <label>Name</label><br />
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            disabled={hasReachedLimit}
                        />
                    </div>

                    <div className="form-field">
                        <label>Password</label><br />
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            disabled={hasReachedLimit}
                        />
                    </div>
                    
                    <div className="form-field">
                        <label>Confirm Password</label><br />
                        <input
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            disabled={hasReachedLimit}
                        />
                    </div>
                    <button className="submit-btn" type="submit" disabled={isSubmitting || hasReachedLimit}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                    {hasReachedLimit && (
                        <p className="error-msg">
                            You have reached the maximum number of profiles for the {planName} plan.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateChild;
