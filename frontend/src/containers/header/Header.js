import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header id="header" className="header">
      <div className="header-content">
        <h1>Every snapshot holds a <br />world of discovery</h1>
        <p>Capture. Cherish. Learn.</p>
        <button className="header-button">Get Started Now</button>
      </div>
    </header>
  );
}

export default Header;