import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import HeaderPriv from '../components/HeaderPriv.js';
import FooterPriv from '../components/FooterPriv.js';
import "../styles/Request.css"; // Import the CSS file for styling

const RequestBooking = () => {
  const [staffName, setStaffName] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [fromHour, setFromHour] = useState("");
  const [fromMin, setFromMin] = useState("");
  const [toHour, setToHour] = useState("");
  const [toMin, setToMin] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);

  // Add time slot to the list
  const addTimeSlot = () => {
    if (date && month && fromHour && fromMin && toHour && toMin) {
      const timeSlot = `${date}/${month} from ${fromHour.padStart(
        2,
        "0"
      )}:${fromMin.padStart(2, "0")} to ${toHour.padStart(
        2,
        "0"
      )}:${toMin.padStart(2, "0")}`;

      setTimeSlots([...timeSlots, timeSlot]);
      resetTimeFields();
    } else {
      alert("Please fill in all fields to add a time slot.");
    }
  };

  // Reset time input fields
  const resetTimeFields = () => {
    setDate("");
    setMonth("");
    setFromHour("");
    setFromMin("");
    setToHour("");
    setToMin("");
  };

  // Handle form submission
  const handleRequest = () => {
    if (staffName && timeSlots.length > 0) {
      console.log("Request Submitted:", {
        staffName,
        timeSlots,
      });
      alert("Your request has been submitted!");
      setStaffName("");
      setTimeSlots([]);
    } else {
      alert("Please provide staff name and at least one time slot.");
    }
  };

  return (
    <div className="container">
		<header><HeaderPriv/></header>
        <div className="request-booking-container">
            <SideMenu />

            <div className="request-booking-content">
                <h1 className="request-title">Request Booking</h1>

                {/* Staff Name Input */}
                <input
                type="text"
                placeholder="Staff name (sends feedback if name not in database)"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="input-field"
                />

                {/* Time Slot Input */}
                <div className="time-slot-inputs">
                    <select
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="dropdown"
                    >

                        <option value="">Month</option>
                            {[
                            "01",
                            "02",
                            "03",
                            "04",
                            "05",
                            "06",
                            "07",
                            "08",
                            "09",
                            "10",
                            "11",
                            "12",
                            ].map((m, i) => (
                            <option key={i} value={m}>
                                {m}
                        </option>
                        ))}
                    </select>

                    {/* Time Ranges */}
                    <label>From:</label>
                    <select
                        value={fromHour}
                        onChange={(e) => setFromHour(e.target.value)}
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
                        value={fromMin}
                        onChange={(e) => setFromMin(e.target.value)}
                        className="dropdown time-dropdown"
                    >
                        <option value="">Min</option>
                        {[0, 15, 30, 45].map((m) => (
                        <option key={m} value={m}>
                            {m.toString().padStart(2, "0")}
                        </option>
                        ))}
                    </select>

                    <label>To:</label>
                    <select
                        value={toHour}
                        onChange={(e) => setToHour(e.target.value)}
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
                        value={toMin}
                        onChange={(e) => setToMin(e.target.value)}
                        className="dropdown time-dropdown"
                    >
                        <option value="">Min</option>
                        {[0, 15, 30, 45].map((m) => (
                        <option key={m} value={m}>
                            {m.toString().padStart(2, "0")}
                        </option>
                        ))}
                    </select>

                    {/* Add Time Slot Button */}
                    <button type="button" className="add-button" onClick={addTimeSlot}>
                        Add time slot
                    </button>
                    </div>

                    {/* Display Added Time Slots */}
                    <div className="time-slots-list">
                    <h3>Picked time slots:</h3>
                    <ul>
                        {timeSlots.map((slot, index) => (
                        <li key={index}>{slot}</li>
                        ))}
                    </ul>
                </div>

                {/* Request Button */}
                <button type="button" className="request-button" onClick={handleRequest}>
                    Request
                </button>
            </div>
        </div>
        <footer><FooterPriv/></footer>
    </div>
  );
};

export default RequestBooking;
