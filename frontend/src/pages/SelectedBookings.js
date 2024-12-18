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
                            number={new Date(booking.date).getDate().toString().padStart(2, '0')}
                            month={new Date(booking.date).toLocaleString('default', { month: 'short' })}
                            professorName={booking.professor}
                            time={`${booking.startTime} - ${booking.endTime}`}
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