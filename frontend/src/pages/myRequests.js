import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideMenu.js";
import CalendarEvent from "../components/CalendarEvent";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import "../styles/myBookings.css";

function MyRequests() {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");
  // console.log("token", token) //test
  // console.log("id", id) //test

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(
          `http://127.0.0.1:5000/api/members/${id}/requested_appointments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("data is", data); //test
            const addBooking = (newBook) => {
              const book = newBook.map((booking) => ({
                professor: booking.requestedAppointment.professor,
                date: booking.requestedAppointment.date,
                startTime: booking.requestedAppointment.startTime,
                endTime: booking.requestedAppointment.endTime,
                _id: booking._id,
                email: booking.requestingEmail
              }))
            }
            setBookings((bookings) => [...bookings, ...book]);
            });
      } catch (error) {
        console.log(error);
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
            {bookings.map((booking, index) => (
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
            ))}
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
