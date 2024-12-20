import React, { useState, useEffect } from "react";
import CalendarEvent from "../components/CalendarEvent.js";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/myBookings.css";

function Booked() {
  const [bookings, setBookings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [isEmailEntered, setIsEmailEntered] = useState(false);

  const userEmail = localStorage.getItem('guestEmail');
  const id = localStorage.getItem("userId");
  const token = localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchDataForLoggedInUser();
    }
  }, []);

  let isFetching = false;  // Lock variable to ensure only one fetch call happens at a time
  const fetchDataForLoggedInUser = async () => {
    if (isFetching) return;  // If a fetch request is already in progress, exit early

    isFetching = true;  // Set the lock to true to indicate the fetch is in progress
    console.log(id);
    console.log(token);
    console.log(userEmail);

    try {
      const response = await fetch(`http://localhost:5000/api/members/${id}/request_attendance`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'email': userEmail
        }
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(data.attendances || []);
      } else {
        console.error("Failed to fetch data:", data.message);
      }
    } catch (error) {
      console.log("User error:", error);
    } finally {
      isFetching = false;  // Release the lock after the fetch is complete
    }
  };

  const fetchDataForGuestUser = async (email) => {
    try {
      await fetch(`http://localhost:5000/api/guests/`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'email': email,
        },
      })
        .then(res => res.json())
        .then(data => {
          setBookings(data.attendances || []);
        });
    } catch (error) {
      console.log("Guest error: ", error);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (guestEmail) {
      setIsEmailEntered(true);
      fetchDataForGuestUser(guestEmail);
    }
  };

  return (
    <div className="container">
      <Header />
      <main className="mybookings-container">
        <div className="content">
          {isLoggedIn ? (
            <div className="bookings-list">
              {bookings.map((booking, index) => (
                <CalendarEvent
                  key={index}
                  professor={booking.professor}
                  date={booking.date}
                  startTime={booking.startTime}
                  endTime={booking.endTime}
                  isRecurring={booking.isRecurring}
                  page=""
                  bookingId=""
                  email=""
                />
              ))}
            </div>
          ) : (
            <div>
              {!isEmailEntered ? (
                <div className="email-input">
                  <p>Enter your email:</p>
                  <form onSubmit={handleEmailSubmit}>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                  </form>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((booking, index) => (
                    <CalendarEvent
                      key={index}
                      professor={booking.professor}
                      date={booking.date}
                      startTime={booking.startTime}
                      endTime={booking.endTime}
                      isRecurring={booking.isRecurring}
                      page=""
                      bookingId=""
                      email={guestEmail}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <div className="footer"><Footer /></div>
    </div>
  );
}

export default Booked;
