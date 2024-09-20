import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaFacebook, FaInstagram } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [slide, setSlide] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const user_id = localStorage.getItem('user_id');
    const profile = localStorage.getItem('profile');

    const handleNav = () => {
        setNav(!nav);
        setSlide(!slide);
    };

    const handleClose = () => {
        setNav(false); 
        setSlide(false); 
    };

    const handleLogout = async () => {
        const response = await fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            localStorage.removeItem('user_id');
            localStorage.removeItem('profile'); 
            navigate('/login');
        } else {
            alert("Logout failed. Please try again.");
        }
    };

    // Home page link based on profile
    const getHomeLink = () => {
        if (profile === 'admin') {
            return '/adminhome';
        } else if (profile === 'parent') {
            return '/parenthome';
        } else if (profile === 'child') {
            return '/childhome';
        } else {
            return '/';
        }
    };

    // Determine if the current page is one of the main pages (where navbar should not be sticky)
    const isNonStickyPage = ['/', '/#features', '/#about', '/#faq', '/#contact'].includes(location.pathname);

    useEffect(() => {
        const sectionId = location.hash.replace("#", "");
        if (sectionId) {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);

    return (
        <div className={`navbar ${isNonStickyPage ? '' : 'sticky'}`}>
            <div className='container'>
                <div className={slide ? 'logo slide-right' : 'logo'}>
                    <h3>SeeSay Moments.</h3>
                </div>

                <ul className={nav ? 'nav-menu active' : 'nav-menu'}>
                <li><Link onClick={handleClose} to="/#header">Home</Link></li>                    <li><Link onClick={handleClose} to="/#features">Features</Link></li>
                    <li><Link onClick={handleClose} to="/#about">About</Link></li>
                    <li><Link onClick={handleClose} to="/#faq">FAQ</Link></li>
                    <li><Link onClick={handleClose} to="/#contact">Contact</Link></li>

                    {user_id ? (
                        <>
                            {profile === 'admin' ? (
                                <li>
                                    {/* change to edit account page */}
                                    <Link to="/" className="profile-link" onClick={handleClose}>
                                        Account
                                    </Link>
                                </li>
                            ) : profile === 'child' ? (
                                <li>
                                    {/* change to customisation page */}
                                    <Link to="/" className="profile-link" onClick={handleClose}>
                                        Customization
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <Link to="/profile" className="profile-link" onClick={handleClose}>
                                        Profiles
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout} className="auth-button">Logout</button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button onClick={() => navigate('/login')} className="auth-button">Login</button>
                        </li>
                    )}

                    <div className='mobile-menu'>
                        <div className="social-icons">
                            <FaFacebook className='icon' />
                            <FaInstagram className='icon' />
                        </div>
                    </div>
                </ul>

                <div className="hamburger" onClick={handleNav}>
                    {nav ? (<FaTimes size={20} style={{ color: '#ffffff' }} />) : (<FaBars style={{ color: '#ffffff' }} size={20} />)}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
