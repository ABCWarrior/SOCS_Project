import React, { useState, useEffect } from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import CalendarEvent from '../components/CalendarEvent.js';
import '../styles/SelectedBookings.css';

const SelectedBookings = () => {
    const [booking, setBooking] = useState(null);
    useEffect(() => {
        const storedBooking = localStorage.getItem('selectedBooking');
        if (storedBooking) {
            try {
                const parsedBooking = JSON.parse(storedBooking);
                setBooking(parsedBooking);
            } catch (error) {
                console.error('Error parsing booking:', error);
            }
        }
    }, []);

    return (
        <div className="bookings-container">
            <Header />
            <main className="landing-main">
                <div className="content-wrapper">
                    {booking ? (
                        <CalendarEvent 
                            professor={booking.professor}
                            date={booking.date}
                            startTime={booking.startTime}
                            endTime={booking.endTime}
                            isRecurring={booking.isRecurring}
                            page=""
                            id={booking._id}
                            email=""
                        />
                    ) : (
                        <p className="none">No booking selected</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SelectedBookings;