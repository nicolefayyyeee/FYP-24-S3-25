import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../containers/modal/Modal";
import useModal from "../containers/hooks/useModal"; 
import { FaStar } from "react-icons/fa";
import "./ParentHome.css";

const AddReview = () => {
    const navigate = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        rating: 0,
        description: "",
        type: "",
    });
    const [errorMessage, setErrorMessage] = useState('');
    const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal();
    
    const submit = async () => {
        const userId = localStorage.getItem('user_id');
        if (form.rating === 0 || form.description === "" || form.type === "") {
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
                    description: form.description,
                    type: form.type,
                    user_id: userId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                openModal("Success", data.message, () => {
                    navigate("/parentHome");
                });
              } else {
                setErrorMessage(data.message);
              }

        } catch (error) {
            openModal("Error", error.message, closeModal);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStarClick = (ratingValue) => {
        setForm({ ...form, rating: ratingValue });
    };

    return (
        <div className="adminHome">
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                onConfirm={modalAction}
                header={modalHeader}
                message={modalMessage}
            />
            <div className="parent-welcome-header">
                <h2>Add a Review</h2>
                <p>Fill in the form below to leave a review</p>
                <button className="parent-profile-btn" onClick={() => navigate("/parentHome")}>
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
                        <label>Type</label><br/>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}>
                            <option value="">Select Type</option>
                            <option value="Customer Service">Customer Service</option>
                            <option value="Image Captioning">Image Captioning</option>
                            <option value="Text to Speech">Text to Speech</option>
                            <option value="Image Gallery">Image Gallery</option>
                            <option value="Child Games">Child Games</option>
                            <option value="Server Error">Server Error</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Description</label><br/>
                        <textarea
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={5} 
                            style={{ fontSize: '14px' }}
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
