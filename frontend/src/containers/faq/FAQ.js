import React, { useState } from 'react';
import './FAQ.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Import FontAwesome
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is SeeSay Moments and what does it do?',
      answer: 'SeeSay Moments is an interactive photo app designed for children, allowing them to capture and describe their world through photos and voice annotations. It includes interactive games that enhance learning and creativity, providing a playful and educational platform for kids to explore their surroundings, express themselves, and discover new things.',
    },
    {
      question: 'How often are there updates?',
      answer: 'We are dedicated to enhancing SeeSay Moments and providing the best experience for our young users. Expect regular updates with new features, interactive games, and improvements to keep the app engaging and fresh.',
    },
    {
      question: 'What makes SeeSay Moments the best app for kids?',
      answer: 'SeeSay Moments stands out by combining photo capturing with interactive voice annotations and engaging games, encouraging creativity and self-expression. Our app provides a safe, fun, and educational environment where children can explore and learn about their world while enjoying a personalized and interactive experience. Additionally, parents can monitor their child\'s progress and activity within the app, ensuring a balanced and supportive learning experience.',
    },
    {
      question: 'How can I monitor my child’s progress on SeeSay Moments?',
      answer: 'Parents can easily monitor their child\'s progress by accessing the parent dashboard within the app. This dashboard provides insights into the activities their child has engaged in, the games they have played, and the skills they have developed. It allows parents to track their child’s learning journey and encourage further exploration and creativity.',
    },
    {
      question: 'Is SeeSay Moments safe for children?',
      answer: 'Yes, SeeSay Moments is designed with child safety in mind. The app includes features that ensure a secure environment for kids. We monitor content and interactions within the app to create a safe space for children to explore and learn. Additionally, parental controls are available, allowing parents to set boundaries and manage their child’s usage of the app.',
    },
  ];

  return (
    <div id="faq" className="faq">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            If you have any questions about SeeSay Moments, we're happy to help! <br />
            Check out some of our most frequently asked questions below.
          </p>
        </div>
        <div className="faq-content">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className="faq-icon">
                  {activeIndex === index ? (
                    <FontAwesomeIcon icon={faMinus} />
                  ) : (
                    <FontAwesomeIcon icon={faPlus} />
                  )}
                </span>
              </h3>
              {activeIndex === index && (
                <p className="faq-answer">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
