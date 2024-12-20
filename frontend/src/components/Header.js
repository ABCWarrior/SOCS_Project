//Louis

import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import logo from '../img/logo_color.jpg';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        throw new Error('No user credentials found');
      }

      const response = await fetch(`https://fall2024-comp307-group16.cs.mcgill.ca/apiapi/${userId}/logout`, {
        method: 'POST',
        headers: {
          'token': token
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      localStorage.setItem("userEmail", '');

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
    <header className="header-container">
      <div className="logo-container">
        <a href="/">
          <img
            src={logo}
            alt="McGill logo"
            className="logo"
            style={{ width: '250px', height: 'auto' }}
          />
        </a>
      </div>

      <div className="mobile-menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
      </div>

      <nav className={`header-nav ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
        {isLoggedIn ? (
          <>
            <a
              href="/booked-appointments"
              onClick={() => setIsMenuOpen(false)}
            >
              <b>Booked Appointments</b>

            </a>
            <a
              href="/mybookings"
              onClick={() => setIsMenuOpen(false)}
            >
              <b>Dashboard</b>
            </a>
            <a
              href="#"
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              <b>Logout</b>
            </a>
          </>
        ) : (
          <>
            <a
              href="/booked-appointments"
              onClick={() => setIsMenuOpen(false)}
            >
              <b>Booked Appointments</b>
            </a>

            <a
              id="register"
              href="/register"
              onClick={() => setIsMenuOpen(false)}
            >
              <b>Register</b>
            </a>
            <a
              id="login"
              href="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              <b>Log in</b>
            </a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
