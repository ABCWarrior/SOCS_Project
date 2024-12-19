import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import "../styles/Create.css";

const CreateBooking = () => {
    const token = localStorage.getItem('token');
    const professor = localStorage.getItem('professorName');
    const id = localStorage.getItem('userId')

    const [formData, setFormData] = useState({
        recurrence: "",
        date: "",
        day: "",
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

        const requiredFields = formData.recurrence === "weekly" 
            ? ["recurrence", "day", "fromHour", "fromMin", "toHour", "toMin"]
            : ["recurrence", "date", "month", "fromHour", "fromMin", "toHour", "toMin"];

        const isFormValid = requiredFields.every(field => 
            formData[field] !== "" && formData[field] !== null
        );

        if (!isFormValid) {
            alert("Please fill out all the required fields before submitting.");
            return;
        }

        var isRecurring;
        var date;

        if(formData.recurrence === "weekly"){
            isRecurring = true;
            date = formData.day
        }
        else{
            isRecurring = false;
            const currentYear = new Date().getFullYear();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const monthIndex = monthNames.indexOf(formData.month) + 1;
            const month = monthIndex.toString().padStart(2, "0");
        
            const day = formData.date.toString().padStart(2, "0");
            date = `${currentYear}-${month}-${day}`;
        }

        var startTime = `${formData.fromHour.padStart(2, "0")}:${formData.fromMin.padStart(2, "0")}`;
        var endTime = `${formData.toHour.padStart(2, "0")}:${formData.toMin.padStart(2, "0")}`;

        try {
            const response = await fetch(`http://localhost:5000/api/members/${id}/create_booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    professor,
                    date,
                    startTime,
                    endTime,
                    isRecurring
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Booking created successfully:", result.message);
                alert("Booking created")
            } else {
                console.error("Failed to create booking:", result.message);
                alert("Booking creation failed")
            }
        } catch (err) {
            console.error("Error during API call:", err);
            alert("Error in creating booking")
        }

        console.log("Form Data Submitted:", token,
            professor,
            date,
            startTime,
            endTime,
            isRecurring
        );
    };

  return (
    <div className="container">
		<Header/>
        <div className="create-booking-container">
            <SideMenu />

            <div className="create-booking-content">

                <form onSubmit={handleSubmit} className="create-booking-form">

                    {/* Recurrence Dropdown */}
                    <select
                        name="recurrence"
                        value={formData.recurrence}
                        onChange={handleChange}
                        className="recurrence-dropdown"
                    >
                        <option value="" disabled>
                            Recurrence
                        </option>
                        <option value="one-time">One-Time</option>
                        <option value="weekly">Weekly</option>
                    </select>

                    {/* Date and Month Dropdowns */}
                    <div className="date-time-container">
                        {formData.recurrence === "weekly" ? (
                            // Day selection for weekly recurrence
                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                className="dropdown"
                            >
                            <option value="" disabled>Day</option>
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                                    (day, i) => (
                                        <option key={i} value={day}>
                                            {day}
                                        </option>
                                    )
                                )}
                                </select>
                        ) : (
                            // Default Date and Month selection
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
                        )}
                    </div>

                    {/* Time Selection */}
                    <div className="time-container">
                        <div>
                        <label>From:</label>
                        <select
                            name="fromHour"
                            value={formData.fromHour}
                            onChange={handleChange}
                            className="time-dropdown"
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
                            className="time-dropdown"
                        >
                            <option value="" disabled>Min</option>
                            {[0, 15, 30, 45].map((min) => (
                                <option key={min} value={min}>
                                    {min.toString().padStart(2, "0")}
                                </option>
                            ))}
                        </select>
                        </div>

                        <div>
                        <label>To:</label>
                        <select
                            name="toHour"
                            value={formData.toHour}
                            onChange={handleChange}
                            className="time-dropdown"
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
                            className="time-dropdown"
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

                    {/* Submit Button */}
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
        <div className="footer"><Footer/></div>
    </div>
  );
};

export default CreateBooking;
