//Celia Shi Aakarsh Dhar

import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideMenu.js";
import CalendarEvent from "../components/CalendarEvent";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import "../styles/myBookings.css";

function MyRequests() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://fall2024-comp307-group16.cs.mcgill.ca/apiapi/members/${id}/requested_appointments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );
        const data = await response.json();

        console.log("data is", data);

        const mappedBookings = data.map((booking) => ({
          professor: booking.requestedAppointment.professor,
          date: booking.requestedAppointment.date,
          startTime: booking.requestedAppointment.startTime,
          endTime: booking.requestedAppointment.endTime,
          _id: booking._id,
          email: booking.requestingEmail,
          professorDatabaseId: booking.requestedAppointment.professorDatabaseId
        }));

        setBookings(mappedBookings);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setBookings([]);
      }
    };

    fetchData();
  }, [id, token]);


  return (
    <div className="container">
      <Header />
      <main className="mybookings-container">
        <Sidebar />
        <div className="content">
          <div className="bookings-list">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <CalendarEvent
                  key={index}
                  professor={booking.professor}
                  date={booking.date}
                  startTime={booking.startTime}
                  endTime={booking.endTime}
                  isRecurring={false}
                  page="myrequests"
                  bookingId={booking._id}
                  email={booking.email}
                />
              ))
            ) : (
              <p>No requested appointments found.</p>
            )}
          </div>
        </div>
      </main>
      <div className="footer">
        <Footer />
      </div>

    </div>
  );
}

export default MyRequests;
