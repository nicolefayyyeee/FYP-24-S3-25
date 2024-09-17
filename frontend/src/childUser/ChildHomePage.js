import React from 'react';
import { Link } from 'react-router-dom';
import './ChildHomePage.css'; // Custom styles for the home page
import Navbar from "../containers/navbar/Navbar";
import Footer from "../containers/footer/Footer";


const ChildHomePage = () => {
    return (
        <>
           <Navbar /> 
           
           <div className="childHome">
                <div className="welcome-header">
                    <h2>Welcome, Junior Explorer!</h2>
                    <p>Let's capture your world and bring your moments to life!</p>
                    <button className="profile-btn">Edit Profile</button>
                </div>
                <div className="options-grid">
                    <div className="option-card red">
                    <Link to="/snap">Snap a Memory</Link>
                    </div>
                    <div className="option-card yellow">
                    <Link to="/moments">My Moments</Link>
                    </div>
                    <div className="option-card green">
                    <Link to="/gallery">Explore the Gallery</Link>
                    </div>
                    <div className="option-card blue">
                    <Link to="/games">Games</Link>
                    </div>
                    <div className="option-card purple">
                    <Link to="/creative-corner">Creative Corner</Link>
                    </div>
                    <div className="option-card pink">
                    <Link to="/achievements">My Achievements</Link>
                    </div>
                </div>
            </div>
            
           <Footer />
        </>
    )
}

export default ChildHomePage;
