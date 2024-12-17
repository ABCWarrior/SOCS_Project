// ./components/Header.js
import React from 'react';
import '../styles/Header.css'; // Assuming some external styling
import logo from '../img/logo_color.jpg';

const HeaderPriv = () => {
    return (
        <header className="header-container">
            <div className="logo-container">
                <a href="/">
                    <img src={logo} alt="McGill logo" className="logo"
                    style={{ width: '250px', height: 'auto' }} href="/"/>
                </a>
            </div>
            {/* <nav className="header-nav">
                <a id="login" href="/login"><b>Logged in as Y</b></a>
                need to implement what type of user they are
            </nav> */}
        </header>
    );
};

export default HeaderPriv;
