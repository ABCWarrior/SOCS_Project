//Louis

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://fall2024-comp307-group16.cs.mcgill.ca/apiapi/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isGuest", "false");

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("professorName", data.professorName);

        localStorage.setItem("guestEmail", email);

        document.cookie = `userEmail=${email}; expires=${new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toUTCString()}; path=/`;
        document.cookie = `userToken=${data.token}; expires=${new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toUTCString()}; path=/`;

        if (
          localStorage.getItem("isBooking") &&
          localStorage.getItem("selectedBookingCode") != ""
        ) {
          navigate("/SelectedBookings");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="login-page-container">
      <Header />
      <main className="login-main">
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h1>Log in to your account</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
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
                required
              />
            </div>
            <button type="submit" className="login-button">
              <a
                id="login"
                href="/login"
                onClick={() => {
                  localStorage.setItem("isBooking", false);
                  localStorage.setItem("selectedBookingCode", "");
                }}
              >
                <b>Log in</b>
              </a>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
