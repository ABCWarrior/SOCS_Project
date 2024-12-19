import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import '../styles/Intermediary.css';

const Intermediary = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGuestContinue = async (e) => {
    e.preventDefault();
    setError('');

    localStorage.setItem('guestEmail', email)

    try {
      const response = await fetch('http://localhost:5000/api/login/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          professor: "",
          email, 
          password: "" 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful', data);
        navigate('/selected-bookings');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
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