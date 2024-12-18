import React from 'react';
import { NavLink } from "react-router-dom";
import '../styles/CalendarEvent.css';

const CalendarEvent = ({ number, month, professorName, time }) => {
  return (
    <div className="calendar-event-container">
      <div className="calendar-event-number">{number}</div>
      <div className="calendar-event-details">
        <div className="calendar-event-month">{month}</div>
        <div className="calendar-event-professor">{professorName}</div>
        <div className="calendar-event-time">{time}</div>
      </div>
      <div className="calendar-event-actions">
        <NavLink to="/modify" className="modify-button"> Modify Bookings </NavLink>
        <button className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default CalendarEvent;