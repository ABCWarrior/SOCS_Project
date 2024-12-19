import React, { useState, useEffect } from "react";
import CalendarEvent from "../components/CalendarEvent.js";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/myBookings.css";

function Booked() {
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);

  const filteredBookings = () => {
    return bookings.filter((booking) =>
      booking.professor.toLowerCase().includes(search.toLowerCase())
    )
  }

  //wrote 2 api one for guests which is the commented version and one for members, i'll let you guys do the 
  //logic of knowing which one to call

  // const userEmail = localStorage.getItem('guestEmail');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await fetch(`http://127.0.0.1:5000/api/guests/`, {
  //         method: "GET",
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'email': userEmail
  //         }
  //       })
  //         .then(res => res.json())
  //         .then(data => {
  //           setBookings(data.all_bookings || []);
  //         })
  //     }
  //     catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchData()
  // }, []);

  const userEmail = localStorage.getItem('guestEmail');
  const id = localStorage.getItem("userId");
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`http://127.0.0.1:5000/api/members/${id}/request_attendance`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'token': token,
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
                //these calendar events should have no buttons on the side, in my calendar implementation
                //the last switch statement i return null for buttons so yeah should work if the page is an empty string
                //else just make anoter swtich statement ig
                page=""
                bookingId="" //might need it idk, but since its just view i dont think so
                email=""//same here
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
