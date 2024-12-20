//Louis

import React, { useState, useEffect } from 'react';
import '../styles/Footer.css';
import logo from '../img/logo_bw.jpg';

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [professorName, setProfessorName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedProfessorName = localStorage.getItem('professorName');
    if (token) {
      setIsLoggedIn(true);
      if (storedProfessorName) {
        setProfessorName(storedProfessorName);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

            if (!response.ok) {
                throw new Error('Logout failed');
            }
            localStorage.setItem("userEmail", '');

      const response = await fetch(`https://fall2024-comp307-group16.cs.mcgill.ca/apiapi/${userId}/logout`, {
        method: 'POST',
        headers: {
          'token': token
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      setIsLoggedIn(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      window.location.href = '/login';
    }
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
            <div className="footer-user-info">
              <span className="professor-name">Logged in as {professorName}</span>
              <a href="#" onClick={handleLogout}>Logout</a>
            </div>
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
