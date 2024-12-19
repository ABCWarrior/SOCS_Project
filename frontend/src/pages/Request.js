import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/Request.css";
import { Navigate } from "react-router-dom";

const Request = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: "",
        month: "",
        fromHour: "",
        fromMin: "",
        toHour: "",
        toMin: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isFormValid = Object.values(formData).every((value) => value !== "");

        if (!isFormValid) {
            alert("Please fill out all the required fields before submitting.");
            return;
        }

        const year = new Date().getFullYear();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthIndex = monthNames.indexOf(formData.month) + 1;
        const month = monthIndex.toString().padStart(2, "0");
    
        const day = formData.date.toString().padStart(2, "0");
        const date = `${year}-${month}-${day}`;

        var startTime = `${formData.fromHour.padStart(2, "0")}:${formData.fromMin.padStart(2, "0")}`;
        var endTime = `${formData.toHour.padStart(2, "0")}:${formData.toMin.padStart(2, "0")}`;
        const professor = localStorage.getItem('requestProf');
        const bookingId = localStorage.getItem('requestBookingId');
        const userEmail = localStorage.getItem('guestEmail');
        // const professor = "Matthew";
        // const bookingId = "6763ce6b94edf13c1898c952";
        // const userEmail = "Matthew@mail.mcgill.ca";
        // console.log(`http://localhost:5000/api/bookings/${bookingId}/edit_booking`) test

        try {
            const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/appointment_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail, 
                    professor, 
                    date, 
                    startTime, 
                    endTime
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Booking request successfully:", result.message);
                alert("Successful request!")
                navigate("/SelectedBookings")
            } else {
                console.error("Failed to request booking:", result.message);
                alert("Something went wrong please try again.")
            }
        } catch (err) {
            console.error("Error during API call:", err);
            alert("Something went wrong please try again.")
        }

        console.log("Form Data Submitted:", 
            userEmail, 
            professor, 
            date, 
            startTime, 
            endTime,
            bookingId
        );
    };

  return (
    <div className="container">
		<Header/>
        <div className="request-booking-container">
            <div className="request-booking-content">
                <h1>Reschedule your appointment</h1>
                <form onSubmit={handleSubmit} className="request-booking-form">
                    <div className="request-date-time-container">
                        <>
                            <select
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="dropdown"
                            >
                                <option value="" disabled>Date</option>
                                {[...Array(31)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}
                                </option>
                                ))}
                            </select>

                            <select
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            className="dropdown"
                            >
                                <option value="" disabled>Month</option>
                                {[
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December",
                                ].map((month, i) => (
                                    <option key={i} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </>
                    </div>

                    <div className="request-time-container">
    <div className="request-time-row">
        <label>From:</label>
        <select
            name="fromHour"
            value={formData.fromHour}
            onChange={handleChange}
            className="dropdown request-time-dropdown"
        >
            <option value="" disabled>Hour</option>
            {[...Array(24)].map((_, i) => (
                <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                </option>
            ))}
        </select>

        <select
            name="fromMin"
            value={formData.fromMin}
            onChange={handleChange}
            className="dropdown request-time-dropdown"
        >
            <option value="" disabled>Min</option>
            {[0, 15, 30, 45].map((min) => (
                <option key={min} value={min}>
                    {min.toString().padStart(2, "0")}
                </option>
            ))}
        </select>
    </div>

    <div className="time-row">
        <label>To:</label>
        <select
            name="toHour"
            value={formData.toHour}
            onChange={handleChange}
            className="dropdown request-time-dropdown"
        >
            <option value="" disabled>Hour</option>
            {[...Array(24)].map((_, i) => (
                <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                </option>
            ))}
        </select>

        <select
            name="toMin"
            value={formData.toMin}
            onChange={handleChange}
            className="dropdown request-time-dropdown"
        >
            <option value="" disabled>Min</option>
            {[0, 15, 30, 45].map((min) => (
                <option key={min} value={min}>
                    {min.toString().padStart(2, "0")}
                </option>
            ))}
        </select>
    </div>
</div>

                    <button type="submit" className="submit-button">
                        Request
                    </button>
                </form>
            </div>
        </div>
        <Footer/>
    </div>
  );
};

export default Request;
