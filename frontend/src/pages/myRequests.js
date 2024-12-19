import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideMenu.js";
import CalendarEvent from "../components/CalendarEvent";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/myBookings.css";

function MyBookings() {
  	// const [search, setSearch] = useState("");
  
  	// const bookings = [
	// 	{ professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false, _id: "1"},
	// 	{ professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false, _id: "1"},
	// 	{ professor: "Jhon", date: "2024-02-01", startTime: "04:15", endTime: "04:30", isRecurring: false, _id: "1"},
	// ];

	// const filteredBookings = bookings.filter((booking) =>
	// 	booking.professor.toLowerCase().includes(search.toLowerCase())
	// );

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
					fetch(`http://127.0.0.1:5000/api/members/${id}/dashboard`, {
						method: "GET",
						headers: {
							'Content-Type': 'application/json',
							'token': token
						}
					})
					.then(res => res.json())
					.then( data => {
						setBookings(data.all_bookings || []);
					})
				}
				catch (error) {
					console.log(error)
				}
			}
			fetchData()
			// console.log(bookings._id)//not able to get the id
		});
	

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
								id="6763331f55cf2dfd1e95c315"
								email="someone@mail.mcgill.ca"
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