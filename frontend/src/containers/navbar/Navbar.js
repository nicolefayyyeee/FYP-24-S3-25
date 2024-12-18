import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaFacebook, FaInstagram } from 'react-icons/fa';
import './Navbar.css';
import logoSmall from '../../images/logo-small.png'; 
import logoWord from '../../images/logo-word.png'; 



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
            localStorage.removeItem('username');
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
        // scroll to top on route change
        if (!location.hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // scroll to section if hash exists
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
                    <Link to={getHomeLink()} style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                        <img src={logoSmall} alt="Logo Small" style={{ height: '50px', marginRight: '8px' }} /> {/* Icon image */}
                        <img src={logoWord} alt="Logo Word" style={{ height: '70px' }} /> {/* Word image */}
                    </Link>
                </div>

                <ul className={nav ? 'nav-menu active' : 'nav-menu'}>
                    {!user_id && (
                        <>
                            <li><Link onClick={handleClose} to="/#header">Home</Link></li>                    
                            <li><Link onClick={handleClose} to="/#features">Features</Link></li>
                            <li><Link onClick={handleClose} to="/#faq">FAQ</Link></li>
                            <li><Link onClick={handleClose} to="/#contact">Contact</Link></li>
                        </>
                    )}

                    {user_id ? (
                        <>
                            {profile === 'admin' ? (
                                <>
                                    <li><Link to="/manageAccounts" onClick={handleClose}>Manage Accounts</Link></li>
                                    <li><Link to="/manageUserProfiles" onClick={handleClose}>Manage Profiles</Link></li>
                                    <li><Link to="/viewAllReviews" onClick={handleClose}>Reviews</Link></li>
                                    <li><Link to="/editAccount" className="profile-link" onClick={handleClose}>My Account</Link></li> 
                                </>  
                                
                            ) : profile === 'parent' ? (
                                <>
                                <li><Link to="/profile" className="profile-link" onClick={handleClose}>Child Profiles</Link> </li>
                                <li><Link to="/editAccount" className="profile-link" onClick={handleClose}>My Account</Link></li>
                                </>
                            ) : null}
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
