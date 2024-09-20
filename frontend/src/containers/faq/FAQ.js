import React from 'react';
import './FAQ.css';

const FAQ = () => {
  return (
    <section className="faq-container">
      <div className="faq-header">
        <h2 className="faq-title">Frequently <br></br> Asked <br></br> Questions</h2>
        <p className="faq-subtitle">
          If you have any questions about SeeSay Moments, we're happy to help! <br />
          Check out some of our most frequently asked questions below.
        </p>
      </div>
      <div className="faq-content">
        <div className="faq-item">
          <h3 className="faq-question">What is SeeSay Moments and what does it do?</h3>
          <p className="faq-answer">
            SeeSay Moments is an interactive photo app designed for children, allowing them to capture and describe their world through photos and voice annotations. It includes interactive games that enhance learning and creativity, providing a playful and educational platform for kids to explore their surroundings, express themselves, and discover new things.
          </p>
        </div>
        <div className="faq-item">
          <h3 className="faq-question">How often are there updates?</h3>
          <p className="faq-answer">
            We are dedicated to enhancing SeeSay Moments and providing the best experience for our young users. Expect regular updates with new features, interactive games, and improvements to keep the app engaging and fresh.
          </p>
        </div>
        <div className="faq-item">
          <h3 className="faq-question">What makes SeeSay Moments the best app for kids?</h3>
          <p className="faq-answer">
            SeeSay Moments stands out by combining photo capturing with interactive voice annotations and engaging games, encouraging creativity and self-expression. Our app provides a safe, fun, and educational environment where children can explore and learn about their world while enjoying a personalized and interactive experience. Additionally, parents can monitor their child's progress and activity within the app, ensuring a balanced and supportive learning experience.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
