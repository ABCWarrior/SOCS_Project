import React, { useState } from "react";
import Sidebar from "../components/SideMenu.js";
import CalendarEvent from "../components/CalendarEvent";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/myBookings.css";

function MyBookings() {
  	const [search, setSearch] = useState("");
  
  	const bookings = [
		{ professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false, _id: "1"},
		{ professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false, _id: "1"},
		{ professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false, _id: "1"},
	];

	const filteredBookings = bookings.filter((booking) =>
		booking.professor.toLowerCase().includes(search.toLowerCase())
	);

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
								page="myrequests"
								id={booking._id}
							/>
						))}
					</div>
				</div>
			</main>
			<div className="footer"><Footer/></div>
		</div>
  	);
}

export default MyBookings;