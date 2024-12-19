import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideMenu.js";
import CalendarEvent from "../components/CalendarEvent";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/myBookings.css";

function MyRequests() {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem('token');
  const id = localStorage.getItem('userId')

  const filteredBookings = bookings.filter((booking) =>
    booking.professor.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(`http://127.0.0.1:5000/api/members/${id}/requested_appointments`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        })
          .then(res => res.json())
          .then(data => {
            console.log("data is", data) //test
            setBookings(data.all_bookings || []);
          })
      }
      catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [id, token]);


  return (
    <div className="container">
      <Header />
      <main className="mybookings-container">
        <Sidebar />
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
            {filteredBookings.map((booking, index) => (
              <CalendarEvent
                key={index}
                professor={booking.requestedAppointment.professor}
                date={booking.requestedAppointment.date}
                startTime={booking.requestedAppointment.startTime}
                endTime={booking.requestedAppointment.endTime}
                isRecurring={false}
                page="myrequests"
                bookingId={booking._id}
                email={booking.requestingEmail}
              />
            ))}
          </div>
        </div>
      </main>
      <div className="footer"><Footer /></div>
    </div>
  );
}

export default MyRequests;
