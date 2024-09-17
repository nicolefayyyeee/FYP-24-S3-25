import React from 'react';
import { Link } from 'react-router-dom';
import './ParentHomePage.css'; // Custom styles for the home page
import Navbar from "../containers/navbar/Navbar";
import Footer from "../containers/footer/Footer";


const ParentHomePage = () => {
    return (
        <>
           <Navbar /> 
           
           <div className="parentHome">
                <div className="welcome-header">
                    <h2>Welcome, Parent!</h2>
                    <p>Start your child's learning journey with us!</p>
                    <button className="profile-btn">Edit Profile</button>
                </div>
                <div className="options-grid">
                    <div className="option-card red">
                    <Link to="/snap">Create and Manage Child Account</Link>
                    </div>
                    <div className="option-card yellow">
                    <Link to="/moments">View Child's Achievments and Activity</Link>
                    </div>
                    <div className="option-card blue">
                    <Link to="/gallery">View Subscription Plans</Link>
                    </div>
                </div>
            </div>
            
           <Footer />
        </>
    )
}

export default ParentHomePage;
