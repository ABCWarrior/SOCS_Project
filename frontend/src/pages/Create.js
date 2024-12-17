import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import HeaderPriv from '../components/HeaderPriv.js';
import FooterPriv from '../components/FooterPriv.js';
import "../styles/Create.css";

const CreateBooking = () => {
  const [formData, setFormData] = useState({
    meetingName: "",
    recurrence: "",
    peopleCount: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add API integration or form processing logic here
  };

  return (
    <div className="container">
		<header><HeaderPriv/></header>
        <div className="create-booking-container">
            <SideMenu />

            <div className="create-booking-content">
                <h1 className="create-title">Create Booking</h1>

                <form onSubmit={handleSubmit} className="create-booking-form">
                    {/* Meeting Name */}
                    <input
                        type="text"
                        name="meetingName"
                        placeholder="Meeting name"
                        value={formData.meetingName}
                        onChange={handleChange}
                        className="input-field"
                    />

                    {/* Recurrence Dropdown */}
                    <select
                        name="recurrence"
                        value={formData.recurrence}
                        onChange={handleChange}
                        className="dropdown"
                    >
                        <option value="">Recurrence</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>

                    {/* Number of People */}
                    <input
                        type="number"
                        name="peopleCount"
                        placeholder="Number of people (only accepts int)"
                        value={formData.peopleCount}
                        onChange={handleChange}
                        className="input-field"
                    />

                    {/* Date and Month Dropdowns */}
                    <div className="date-time-container">
                        <select
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="dropdown"
                        >
                        <option value="">Date</option>
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
                        <option value="">Month</option>
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
                        <option value="">Hour</option>
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
                        <option value="">Min</option>
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
                        <option value="">Hour</option>
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
                        <option value="">Min</option>
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
        <footer><FooterPriv/></footer>
    </div>
  );
};

export default CreateBooking;
