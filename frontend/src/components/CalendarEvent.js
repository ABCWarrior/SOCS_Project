import React from 'react';
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
        <button className="modify-button">Modify</button>
        <button className="reschedule-button">Reschedule</button>
        <button className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default CalendarEvent;