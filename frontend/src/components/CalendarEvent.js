import React from 'react';
import { NavLink } from "react-router-dom";
import '../styles/CalendarEvent.css';

const dayAbbreviations = {
    "Monday": "M",
    "Tuesday": "TU",
    "Wednesday": "W",
    "Thursday": "TH",
    "Friday": "F",
    "Saturday": "SA",
    "Sunday": "SU"
};

const CalendarEvent = ({ professor, date, startTime, endTime, isRecurring, page}) => {
    var month
    var number
    
    if(isRecurring){
        number = dayAbbreviations[date]
        month = ""
    }
    else{
        const options = { month: 'long' };
        month = new Date(date).toLocaleString('en-US', options);
        number = date.split("-")[2];
    }
    
    var time = startTime + " - " + endTime;
    return (
        <div className="calendar-event-container">
            <div className="calendar-event-number">{number}</div>
            <div className="calendar-event-details">
                <div className="calendar-event-month">{month}</div>
                <div className="calendar-event-professor">{professor}</div>
                <div className="calendar-event-time">{time}</div>
            </div>

            <div className="calendar-event-actions">
            {page === 'mybookings' ? (
                <>
                <NavLink to="/modify" className="modify-button">
                    Modify
                </NavLink>
                <button className="cancel-button">Cancel</button>
                </>
            ) : page === 'myrequests' ? (
                <>
                <button className="accept-button">Accept</button>
                <button className="reschedule-button">Refuse</button>
                </>
            ) : null}
        </div>
    </div>
    );
};

export default CalendarEvent;