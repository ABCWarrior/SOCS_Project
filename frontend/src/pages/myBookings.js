import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideMenu";
import CalendarEvent from "../components/CalendarEvent";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/myBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem('token');
  const id = localStorage.getItem('userId')

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`https://fall2024-comp307-group16.cs.mcgill.ca/apiapi/members/${id}/dashboard`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'token': token
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
        <Sidebar />
        <div className="content">

          <div className="bookings-list">
            {bookings.map((booking, index) => (
              <CalendarEvent
                key={index}
                professor={booking.professor}
                date={booking.date}
                startTime={booking.startTime}
                endTime={booking.endTime}
                isRecurring={booking.isRecurring}
                page="mybookings"
                bookingId={booking._id}
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

export default MyBookings;
