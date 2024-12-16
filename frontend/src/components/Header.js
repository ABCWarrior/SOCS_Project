import React from 'react';
import '../styles/Header.css';
import logo from '../img/logo_color.jpg';

const Header = () => {
    return (
        <header className="header-container">
            <div className="logo-container">
                <a href="/">
                    <img src={logo} alt="McGill logo" className="logo"
                    style={{ width: '250px', height: 'auto' }} href="/"/>
                </a>
            </div>
            <nav className="header-nav">
                <a id="register" href="/register"><b>Register</b></a>
                <a id="login" href="/login"><b>Log in</b></a>
            </nav>
        </header>
    );
};

export default Header;
