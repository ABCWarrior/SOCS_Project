import React, { useState, useEffect } from "react";
import CalendarEvent from "../components/CalendarEvent.js";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/myBookings.css";

function Booked() {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);

  const userEmail = localStorage.getItem('guestEmail');

  const filteredBookings = () => {
    return bookings.filter((booking) =>
      booking.professor.toLowerCase().includes(search.toLowerCase())
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch('http://127.0.0.1:3000/api/guests/', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'email': userEmail
          }
        })
          .then(res => res.json())
          .then(data => {
            setBookings(data.all_bookings || []);
          })
      }
      catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, []);

  return (
    <div className="container">
      <Header />
      <main className="mybookings-container">
        <div className="content">
          <div className="header">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar"
            />
          </div>

          <div className="bookings-list">
            {filteredBookings().map((booking, index) => (
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
        </div>
      </main>
      <div class="footer"><Footer /></div>
    </div>
  );
}

export default Booked;
