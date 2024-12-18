import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import '../styles/Register.css';

const Registration = () => {
  const [professor, setProfessor] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidMcGillEmail = (email) => {
    const mcgillEmailRegex = /^[a-zA-Z0-9._%+-]+@(mail\.mcgill\.ca|mcgill\.ca)$/;
    return mcgillEmailRegex.test(email);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidMcGillEmail(email)) {
      setError('Please use a valid McGill email address (@mail.mcgill.ca or @mcgill.ca)');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords don\'t match');
      return;
    }

    if (!professor.trim()) {
      setError('Name cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          professor,
          email, 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful', data);
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="registration-page-container">
      <Header />
      <main className="registration-main">
        <div className="registration-container">
          <form className="registration-form" onSubmit={handleRegistration}>
            <h1>Register a new account</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="professor">Full Name:</label>
              <input
                type="text"
                id="professor"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">McGill Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your McGill email"
                required
              />
              <small style={{ color: '#666'}}> 
                Must be @mail.mcgill.ca or @mcgill.ca</small>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="registration-button">
              <b>Sign up</b>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Registration;