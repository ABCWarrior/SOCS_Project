import React, { useState } from 'react';
import '../styles/Header.css';
import logo from '../img/logo_color.jpg';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
      </nav>
    </header>
  );
};

export default Header;