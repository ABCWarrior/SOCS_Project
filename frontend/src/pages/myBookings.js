import React, { useState } from "react";
import Sidebar from "../components/SideMenu";
import CalendarEvent from "../components/CalendarEvent";
import HeaderPriv from '../components/HeaderPriv.js';
import FooterPriv from '../components/FooterPriv.js';
import "../styles/myBookings.css"; // Add your page-specific styling here

function MyBookings() {
  const [search, setSearch] = useState("");
  
  // Example booking data
  const bookings = [
    { number: "05", month: "May", professorName: "Professor Smith", time: "12:00 - 13:00" },
    { number: "10", month: "June", professorName: "Professor Johnson", time: "14:00 - 15:00" },
    { number: "20", month: "July", professorName: "Professor Williams", time: "09:00 - 10:00" },
  ];

  // Filter the bookings based on search input
  const filteredBookings = bookings.filter((booking) =>
    booking.professorName.toLowerCase().includes(search.toLowerCase())
  );

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
					<select className="sort-dropdown">
						<option value="desc">desc</option>
						<option value="asc">asc</option>
					</select>
				</div>

				<div className="bookings-list">
					{filteredBookings.map((booking, index) => (
						<CalendarEvent
							key={index}
							number={booking.number}
							month={booking.month}
							professorName={booking.professorName}
							time={booking.time}
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