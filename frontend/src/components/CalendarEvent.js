//Celia 

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/CalendarEvent.css";

const dayAbbreviations = {
  Monday: "M",
  Tuesday: "TU",
  Wednesday: "W",
  Thursday: "TH",
  Friday: "F",
  Saturday: "SA",
  Sunday: "SU",
};

const token = localStorage.getItem("token");
const id = localStorage.getItem("userId");
// const navigate = useNavigate();

const cancel = async ({ professor, date, startTime, endTime }) => {
  try {

    const response = await fetch(
      `https://fall2024-comp307-group16.cs.mcgill.ca/apiapi/members/${id}/delete_booking`,
      {
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
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Booking cancelled successfully:", data);
      alert("Booking cancelled successfully!");
    } else {
      console.error("Failed to add participant:", data.message);
      alert("Booking cancel failed");
    }
  } catch (error) {
    console.error("Error adding participant:", error);
    alert("Error in booking cancel");
  }
};

const requestDecision = async ({
  answer,
  professor,
  date,
  startTime,
  endTime,
  isRecurring,
  email,
}) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `https://fall2024-comp307-group16.cs.mcgill.ca/apiapi/members/${id}/requested_appointments/confirm_or_deny`,
      {
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
          email,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Request decision set:", data);
      alert("Request answer sent");
    } else {
      console.error("Failed to set request decision:", data.message);
      alert("Request answer failed");
    }
  } catch (error) {
    console.error("Error in setting request decision:", error);
    alert("Error in sending request answer");
  }
};

// BOOKING!
const book = async ({ bookingId }) => {
  var email = localStorage.getItem("guestEmail");

  try {
    const response = await fetch(
      `https://fall2024-comp307-group16.cs.mcgill.ca/apiapi/bookings/${bookingId}/add_participants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Added participant:", data);
      localStorage.setItem("isBooking", "false");
      localStorage.setItem("selectedBookingCode", "");
      alert("You have been booked");
      window.location.href = "/";
    } else {
      console.error("Failed to add participant:", data.message);
      alert("Something went wrong");
    }
  } catch (error) {
    console.error("Error adding participant:", error);
    alert("Something went wrong");
  }
};

const CalendarEvent = ({
  professor,
  date,
  startTime,
  endTime,
  isRecurring,
  page,
  bookingId,
  email,
}) => {
  var month;
  var number;

  if (isRecurring) {
    number = dayAbbreviations[date];
    month = "Weekly";
  } else {
    const options = { month: "long" };
    try {
      month = new Date(date).toLocaleString("en-US", options);
      number = date.split("-")[2];
    } catch {
      number = "";
    }
  }

  var time = startTime + " - " + endTime;
  return (
    <div className="calendar-event-container">
      <div className="calendar-event-number">{number}</div>
      <div className="calendar-event-details">
        <div className="calendar-event-month">{month}</div>
        <div className="calendar-event-professor">{professor}</div>
        <div className="calendar-event-time">{time}</div>
        <div className="calendar-event-time">Booking id is: {bookingId}</div>
      </div>

      <div className="calendar-event-actions">
        {page === "mybookings" ? (
          <>
            <NavLink
              to="/modify"
              onClick={() => {
                localStorage.setItem("modifyBookingId", bookingId);
              }}
              className="modify-button"
            >
              Modify
            </NavLink>
            <button
              className="cancel-button"
              onClick={() =>
                cancel({
                  professor,
                  date,
                  startTime,
                  endTime,
                })
              }
            >
              {" "}
              Cancel
            </button>
          </>
        ) : page === "myrequests" ? (
          <>
            <button
              className="accept-button"
              onClick={() =>
                requestDecision({
                  answer: true,
                  professor,
                  date,
                  startTime,
                  endTime,
                  isRecurring,
                  email,
                })
              }
            >
              Accept
            </button>
            <button
              className="reschedule-button"
              onClick={() =>
                requestDecision({
                  answer: false,
                  professor,
                  date,
                  startTime,
                  endTime,
                  isRecurring,
                  email,
                })
              }
            >
              Refuse
            </button>
          </>
        ) : page === "selectedbookings" ? (
          <>
            <button
              className="cancel-button"
              onClick={() =>
                book({
                  bookingId,
                })
              }
            >
              {" "}
              Book{" "}
            </button>
            <NavLink
              to="/request"
              onClick={() => {
                localStorage.setItem("requestBookingId", bookingId);
                localStorage.setItem("requestProf", professor);

              }}
              className="modify-button"
            >
              Request
            </NavLink>
          </>
        ) : null}
      </div>
    </div>

  );
};

export default CalendarEvent;
