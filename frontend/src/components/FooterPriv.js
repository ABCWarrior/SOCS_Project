// ./components/Footer.js
import React from 'react';
import '../styles/Footer.css';
import logo from '../img/logo_bw.jpg';

const FooterPriv = () => {
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
                    <a href="/submit-ticket">Submit Ticket</a>
                    {/* need to implement log out with token */}
                    <a href="/logout">Log Out</a>
                </div>
            </div>
        </footer>
    );
};

export default FooterPriv;