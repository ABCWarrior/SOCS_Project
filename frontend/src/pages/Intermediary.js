//Louis + Aakarsh Dhar

import React, { useState ,  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import '../styles/Intermediary.css';

const Intermediary = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.setItem('isGuest', 'false');
      localStorage.setItem('isBooking', 'true');
      navigate('/SelectedBookings');
    }
  }, [navigate]);

  const handleGuestContinue = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://fall2024-comp307-group16.cs.mcgill.ca/apiapi/login/check_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.exists) {
        console.log('Guest access successful', data);
        localStorage.setItem('guestEmail', email);
        document.cookie = `userEmail=${email}; expires=${new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
        localStorage.setItem('isGuest', 'true');
        localStorage.setItem('isBooking', 'true');
        navigate('/SelectedBookings');
      } else {
        setError(data.message || 'Failed to continue as guest');
      }
    } catch (err) {
      console.error('Guest access error:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    localStorage.setItem('isBooking', 'true');
    navigate('/login');
  };

  return (
    <div className="intermediary-page-container">
      <Header />
      <main className="intermediary-main">
        <div className="intermediary-container">
          <form className="intermediary-form" onSubmit={handleGuestContinue}>
            {error && <div className="error-message">{error}</div>}

            <button
              type="button"
              className="login-redirect-button"
              onClick={handleLoginRedirect}
            >
              <b>Log in with your account</b>
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="form-group">
              <label htmlFor="email">Continue as guest:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="guest-button">
              <b>Continue as guest</b>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Intermediary;
