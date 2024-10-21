import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./ParentHome.css";

const AddReview = () => {
    const navigate = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        rating: 0,
        content: "",
    });
    const [errorMessage, setErrorMessage] = useState('');
    
    const submit = async () => {
        if (form.rating === 0 || form.content === "") {
            setErrorMessage("Please fill in all fields");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/add_review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: form.rating,
                    content: form.content,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate("/parentHome");
              } else {
                setErrorMessage(data.message);
              }

        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStarClick = (ratingValue) => {
        setForm({ ...form, rating: ratingValue });
    };

    return (
        <div className="adminHome">
            <div className="welcome-header">
                <h2>Add a Review</h2>
                <p>Fill in the form below to leave a review</p>
                <button className="profile-btn" onClick={() => navigate("/parentHome")}>
                        Back to Home
                </button>
            </div>
            <div>
                <form className="form-container" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                {errorMessage && <div className="error-msg">{errorMessage}</div>}
                    <div className="form-field">
                        <label>Rating</label><br/>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={30}
                                    color={star <= form.rating ? "#FFD700" : "#ccc"}
                                    onClick={() => handleStarClick(star)}
                                    style={{ cursor: 'pointer', marginRight: 5 }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="form-field">
                        <label>Description</label><br/>
                        <input
                            type="text"
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
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

export default AddReview;
