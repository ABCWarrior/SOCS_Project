import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideMenu";
import CalendarEvent from "../components/CalendarEvent";
import HeaderPriv from '../components/HeaderPriv.js';
import FooterPriv from '../components/FooterPriv.js';
import "../styles/myBookings.css";

function MyBookings() {
    const [search, setSearch] = useState("");


    // Example booking data
    const bookings = [
        { professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false},
        { professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false},
        { professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false},
    ];

    // Filter the bookings based on search input
    const filteredBookings = bookings.filter((booking) =>
        booking.professor.toLowerCase().includes(search.toLowerCase())
    );

    var token = "eda6dc72e7b43bb1b7b1129f22baaafb3660fc9cdf8861f055e189de92924a1f"

	useEffect(() => { 
        fetch(`http://localhost:5000/api/members/67624ff9e9bba47360fe813d/dashboard?token=${token}`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "token": "eda6dc72e7b43bb1b7b1129f22baaafb3660fc9cdf8861f055e189de92924a1f"
          },
        })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              // Handle unauthorized case, maybe redirect to login
              return response.json().then(data => {
                window.location.href = data.redirectUrl;
                throw new Error('Unauthorized');
              });
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("API Response:", data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        }); 
      }, [token]);

  return (
    <div className="container">
		{/* <header><HeaderPriv/></header> */}
		<HeaderPriv/>
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
					{/* <select className="sort-dropdown">
						<option value="desc">desc</option>
						<option value="asc">asc</option>
					</select> */}
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
      	<div class="footer"><FooterPriv/></div>
    </div>
  );
}

export default MyBookings;