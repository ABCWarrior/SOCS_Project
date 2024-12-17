import React from 'react';
import '../styles/CalendarEvent.css';

const CalendarEvent = ({ number, month, userName, time }) => {
  return (
    <div className="calendar-event-container">
      <div className="calendar-event-number">{number}</div>
      <div className="calendar-event-details">
        <div className="calendar-event-month">{month}</div>
        <div className="calendar-event-professor">{userName}</div>
        <div className="calendar-event-time">{time}</div>
      </div>
    </div>
  );
};

export default CalendarEvent;