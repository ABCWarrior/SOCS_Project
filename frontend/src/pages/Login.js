import React, { useState } from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add login logic here, such as sending the email and password to a server for authentication
    console.log('Logging in with email:', email, 'and password:', password);
  };

  return (
    <div className="login-page-container">
      <Header />
      <main className="login-main">
        <div className="login-container">
          <div className="login-form">
            <h1>Log in to your account</h1>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <button className="login-button" onClick={handleLogin}>
              <b>Log in</b>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;