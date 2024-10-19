import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";
import "./ViewAll.css";

const ViewReviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/view_all_reviews");
                const data = await response.json();
                if (response.ok) {
                    setReviews(data.reviews);
                } else {
                    setError("Error fetching reviews");
                }
            } catch (error) {
                setError("Error fetching reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleToggleDisplay = async (reviewId) => {
        try {
            const response = await fetch(`http://localhost:5000/toggle_display/${reviewId}`, {
                method: "PUT",
            });
            const data = await response.json();
            if (response.ok) {
                setReviews((prevReviews) =>
                    prevReviews.map((review) =>
                        review.id === reviewId ? { ...review, display: data.display } : review
                    )
                );
            } else {
                console.error("Error toggling display status");
            }
        } catch (error) {
            console.error("Error toggling display status", error);
        }
    };

    const renderStars = (rating) => {
        const filledStars = "★".repeat(rating); 
        const emptyStars = "☆".repeat(5 - rating);
        return (
            <>
                <span className="star filled">{filledStars}</span>
                <span className="star empty">{emptyStars}</span>
            </>
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    
    return (
        <div className="adminHome">
            <div className="welcome-header">
                <h2>View All Reviews</h2>
                <p>Click the button to update the review's display status</p>
                <button className="profile-btn" onClick={() => navigate("/adminHome")}>
                    Back to Home
                </button>
            </div>
            {reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <ul className="user-list">
                    {reviews.map((review) => (
                        <li key={review.id} className="user-card">
                            <div className="user-details">
                                <div className="user-header">
                                    <p>Rating: {renderStars(review.rating)}</p>
                                </div>
                                <p><strong>Username:</strong> {review.username}</p>
                                <p><strong>Content:</strong> {review.content}</p>
                                <p><strong>Timestamp:</strong> {review.timestamp}</p>
                                <p><strong>Display:</strong> 
                                <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={review.display}
                                            onChange={() => handleToggleDisplay(review.id)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewReviews;
