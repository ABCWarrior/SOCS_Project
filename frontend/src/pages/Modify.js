import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import HeaderPriv from '../components/HeaderPriv.js';
import FooterPriv from '../components/FooterPriv.js';
import "../styles/Create.css";

const CreateBooking = () => {
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

        var bool;
        var formatDate;

        if(formData.recurrence === "weekly"){
            bool = true;
            formatDate = formData.day
        }
        else{
            bool = false;
            const currentYear = new Date().getFullYear();
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const monthIndex = monthNames.indexOf(formData.month) + 1;
            const month = monthIndex.toString().padStart(2, "0");
        
            const day = formData.date.toString().padStart(2, "0");
            formatDate = `${currentYear}-${month}-${day}`;
        }

        const bookingData = {
            token: "some token",
            professor: "some professor",
            date: formatDate,
            startTime: `${formData.fromHour.padStart(2, "0")}:${formData.fromMin.padStart(2, "0")}`,
            endTime: `${formData.toHour.padStart(2, "0")}:${formData.toMin.padStart(2, "0")}`,
            isRecurring: bool
        };

        try {
            const response = await fetch(`http:localhost/5000/members/:id/create_booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Booking created successfully:", result.message);
            } else {
                console.error("Failed to create booking:", result.message);
            }
        } catch (err) {
            console.error("Error during API call:", err);
        }

        console.log("Form Data Submitted:", bookingData);
        // Add API integration or form processing logic here 
    };

  return (
    <div className="container">
		<HeaderPriv/>
        <div className="create-booking-container">
            <SideMenu />

            <div className="create-booking-content">

                <form onSubmit={handleSubmit} className="create-booking-form">

                    {/* Recurrence Dropdown */}
                    <select
                        name="recurrence"
                        value={formData.recurrence}
                        onChange={handleChange}
                        className="dropdown"
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
                        <label>From:</label>
                        <select
                            name="fromHour"
                            value={formData.fromHour}
                            onChange={handleChange}
                            className="dropdown time-dropdown"
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
                            className="dropdown time-dropdown"
                        >
                            <option value="" disabled>Min</option>
                            {[0, 15, 30, 45].map((min) => (
                                <option key={min} value={min}>
                                    {min.toString().padStart(2, "0")}
                                </option>
                            ))}
                        </select>

                        <label>To:</label>
                        <select
                            name="toHour"
                            value={formData.toHour}
                            onChange={handleChange}
                            className="dropdown time-dropdown"
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
                            className="dropdown time-dropdown"
                        >
                        <option value="" disabled>Min</option>
                        {[0, 15, 30, 45].map((min) => (
                            <option key={min} value={min}>
                                {min.toString().padStart(2, "0")}
                            </option>
                        ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
        <div className="footer"><FooterPriv/></div>
    </div>
  );
};

export default CreateBooking;
