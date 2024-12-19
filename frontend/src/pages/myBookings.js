import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideMenu";
import CalendarEvent from "../components/CalendarEvent";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/myBookings.css";

function MyBookings() {
  const [search, setSearch] = useState("");

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId')

    const bookings = [
        { professor: "Jhon", date: "2024-02-01", startTime: "02:15", endTime: "02:30", isRecurring: false},
        { professor: "Jhon", date: "2024-02-01", startTime: "03:15", endTime: "03:30", isRecurring: false},
        { professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false},
    ];

  // Filter the bookings based on search input
  const filteredBookings = bookings.filter((booking) =>
    booking.professor.toLowerCase().includes(search.toLowerCase())
  );

	useEffect(() => {
        const fetchData = async() => {
            try {
                const response = fetch(`http://localhost:5000/api/members/${id}/dashboard`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "token": token
                    },
                }). then(response => response.json()).then(data  => console.log(data))
            }
            catch (error) {
                console.log(error);
            }
        }

        fetchData()
    })

    return (
        <div className="container">
            <Header/>
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
                                professor={booking.professor}
                                date={booking.date}
                                startTime={booking.startTime}
                                endTime={booking.endTime}
                                isRecurring={booking.isRecurring}
                                page="mybookings"
                            />
                        ))}
                    </div>
                </div>
            </main>
            <div class="footer"><Footer/></div>
        </div>
    );
}

export default MyBookings;
