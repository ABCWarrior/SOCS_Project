import React, { useState, useEffect } from 'react';
import '../styles/Footer.css';
import logo from '../img/logo_bw.jpg';

const Footer = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [professorName, setProfessorName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedName = localStorage.getItem('professorName');
        
        if (token && storedName) {
            setIsLoggedIn(true);
            setProfessorName(storedName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('professorName');
        setIsLoggedIn(false);
        setProfessorName('');
        window.location.href = '/login';
    };

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-address">
                    <address>
                        McGill University<br />
                        James Administration Building<br />
                        845 Sherbrooke Street West<br />
                        Montréal, Quebec  H3A 0G4
                    </address>
                </div>
                <div className="footer-logo-section">
                    <img src={logo} alt="McGill logo" className="logo" />
                    <p className="copyright">Copyright &copy; 2024</p>
                </div>
                <div className="footer-links">
                    {isLoggedIn ? (
                        <>
                            <span>Logged in as {professorName}</span>
                            <a href="#" onClick={handleLogout}>Logout</a>
                        </>
                    ) : (
                        <>
                            <a href="/login">Log In</a>
                            <a href="/register">Register</a>
                        </>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default Footer;