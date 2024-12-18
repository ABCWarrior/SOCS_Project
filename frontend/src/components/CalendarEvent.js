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

const cancel = async ({ professor, date, startTime, endTime}) => {
    var token = "eda6dc72e7b43bb1b7b1129f22baaafb3660fc9cdf8861f055e189de92924a1f";

    try {
        const response = await fetch('http://localhost:5000/api/members/67624ff9e9bba47360fe813d/delete_booking', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                professor,  
                date,
                startTime,    
                endTime, 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Booking deleted successfully:", data);
        } else {
            console.error("Failed to delete booking:", data.message);
        }
    } catch (error) {
        console.error("Error deleting booking:", error);
    }
}

const requestDecision = async ({ answer, professor, date, startTime, endTime, isRecurring }) => {
    var token = "eda6dc72e7b43bb1b7b1129f22baaafb3660fc9cdf8861f055e189de92924a1f"
    var email = "a@mcgill.ca"

    try {
        const response = await fetch('http://localhost:5000/api/members/67624ff9e9bba47360fe813d/request_appointments/confirm_or_deny', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                answer,
                professor,  
                date,
                startTime,    
                endTime,
                isRecurring,
                email
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Request decision set:", data);
        } else {
            console.error("Failed to set request decision:", data.message);
        }
    } catch (error) {
        console.error("Error in request decision set:", error);    }
}

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
                    <button className="cancel-button"
                        onClick={() => cancel({
                            professor,
                            date,
                            startTime,
                            endTime
                    })}> Cancel</button>
                    </>
                ) : page === 'myrequests' ? (
                    <>
                    <button className="accept-button"
                    onClick={() => requestDecision({
                        answer: true, 
                        professor, 
                        date, 
                        startTime, 
                        endTime, 
                        isRecurring
                    })}>Accept</button>
                    <button className="reschedule-button"
                    onClick={() => requestDecision({
                        answer: false, 
                        professor, 
                        date, 
                        startTime, 
                        endTime, 
                        isRecurring
                    })}>Refuse</button>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default CalendarEvent;