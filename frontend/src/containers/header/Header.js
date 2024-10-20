import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../header/Header.css';

const Header = () => {
  return (
    <div id="header" className="header">
      <header>
        <h1>Every snapshot holds a <br />world of discovery</h1>
        <p>Capture. Cherish. Learn.</p>
      </header>
      <br />
      <Link to="/login">
        <button aria-label="Get started with the app">Get Started Now</button>
      </Link>
    </div>
  );
}

export default Header;
