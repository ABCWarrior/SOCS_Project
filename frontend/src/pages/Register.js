import React, { useState } from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import '../styles/Register.css';

const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegistration = () => {
    // Add registration logic here, such as sending the data to a server for account creation
    console.log('Registering user with name:', name, 'email:', email, 'password:', password);
  };

  return (
    <div className="registration-page-container">
      <Header />
      <main className="registration-main">
        <div className="registration-container">
          <div className="registration-form">
            <h1>Register a new account</h1>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
              />
            </div>
            <button className="registration-button" onClick={handleRegistration}>
              <b>Sign up</b>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Registration;