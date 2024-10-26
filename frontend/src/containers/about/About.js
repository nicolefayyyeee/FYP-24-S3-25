import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  // Sample reviews data with star ratings (will input these in db later -kj)
  // const reviews = [
  //   {
  //     name: 'Alice',
  //     text: 'My kids absolutely love SeeSay Moments! It has transformed the way they explore and learn.',
  //     rating: 5,
  //   },
  //   {
  //     name: 'Bob',
  //     text: 'A fantastic app! It encourages my children to be creative and express themselves.',
  //     rating: 4,
  //   },
  //   {
  //     name: 'Charlie',
  //     text: 'SeeSay Moments is a game-changer for our family. Highly recommend it!',
  //     rating: 5,
  //   },
  //   {
  //     name: 'Diana',
  //     text: 'An amazing tool for kids to learn and have fun at the same time.',
  //     rating: 4,
  //   },
  //   {
  //     name: 'Ethan',
  //     text: 'My kids are always excited to use this app and share their experiences!',
  //     rating: 5,
  //   },
  //   {
  //     name: 'Frank',
  //     text: 'An excellent resource for children to learn while playing.',
  //     rating: 4,
  //   },
  // ];


  const [currentIndex, setCurrentIndex] = useState(0); // State to track current review index  
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/view_reviews'); 
        const data = await response.json();

        if (response.ok) {
          setReviews(data.reviews);
        } else {
          setError("Failed to fetch reviews.");
        }
      } catch (error) {
        setError("Error fetching reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Function to go to the next set of reviews
  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(reviews.length / 3));
  };

  // Function to go to the previous set of reviews
  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(reviews.length / 3)) % Math.ceil(reviews.length / 3));
  };

  // Function to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  // Function to render reviews based on current index
  const renderReviews = () => {
    const startIndex = currentIndex * 3;
    const endIndex = Math.min(startIndex + 3, reviews.length); // Ensure we don't go out of bounds

    return reviews.slice(startIndex, endIndex).map((review, index) => (
      <div key={index} className="review-item">
        {/* Render stars at the top center */}
        <div className="stars-container">
          {renderStars(review.rating)}
        </div>
        <p className="review-text">"{review.description}"</p>
        <div className="review-section">
          <p>Topic: {review.type}</p>
          <p>- {review.name}</p>
        </div>
      </div>
    ));
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  
  return (
    <section id="about" className="about">
      {/* Top Wavy Section */}
      <div className="wave-container">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
          <path fill="#2b235a" d="M0,96L30,96C60,96,120,96,180,128C240,160,300,224,360,224C420,224,480,160,540,128C600,96,660,96,720,128C780,160,840,224,900,240C960,256,1020,224,1080,192C1140,160,1200,128,1260,128C1320,128,1380,160,1410,192L1440,224L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0H0Z"></path>
        </svg>
      </div>

      <div className="about-container">
        <h2 className="reviews-title">Hear What Others Have to Say</h2>
        <div className="reviews-section">
          <div className="review-navigation">
            <button onClick={prevReview} className="nav-button">◀</button>
          </div>
          <div className="reviews-content">
            {renderReviews()}
          </div>
          <div className="review-navigation">
            <button onClick={nextReview} className="nav-button">▶</button>
          </div>
        </div>
      </div>

      {/* Bottom Wavy Section */}
      <div className="wave-container">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
          <path fill="#2b235a" d="M0,224L30,197.3C60,171,120,117,180,117.3C240,117,300,171,360,176C420,181,480,139,540,122.7C600,107,660,117,720,128C780,139,840,149,900,154.7C960,160,1020,160,1080,144C1140,128,1200,96,1260,90.7C1320,85,1380,107,1410,117.3L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320H0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default About;
