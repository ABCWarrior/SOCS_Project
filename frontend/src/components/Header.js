import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import logo from '../img/logo_color.jpg';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('professorName');
    
    setIsLoggedIn(false);
    setProfessorName('');
    
    window.location.href = '/login';
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
            id="register" 
            href="#" 
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
          >
            <b>Logout</b>
          </a>
          <a 
            id="login"
            href="/dashboard" 
            onClick={() => setIsMenuOpen(false)}
          >
            <b>Dashboard</b>
          </a>
        </>
        ) : (
          <>
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