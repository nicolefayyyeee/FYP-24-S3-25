import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ParentHome.css";
import "./MyReviews.css";

const MyReviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const userId = localStorage.getItem('user_id');
                const response = await fetch(`http://localhost:5000/my_reviews?user_id=${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setReviews(data.reviews);
                } else {
                    setError("Failed to fetch reviews");
                }
            } catch (error) {
                setError("Error fetching reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

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
            <div className="parent-welcome-header">
                <h2>My Reviews</h2>
                <p>Here are all the reviews made by you</p>
                <button className="parent-profile-btn" onClick={() => navigate("/parentHome")}>
                    Back to Home
                </button>
            </div>
            {reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <ul className="review-list">
                    {reviews.map((review) => (
                        <li key={review.id} className="review-card">
                            <div className="review-details">
                                <div className="review-header">
                                    <p>Rating: {renderStars(review.rating)}</p>
                                </div>
                                <p>{review.content}</p>
                                <p><i>{review.timestamp}</i></p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyReviews;
