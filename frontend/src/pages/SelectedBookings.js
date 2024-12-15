import React from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import CalendarEvent from '../components/CalendarEvent.js';
import '../styles/SelectedBookings.css';

const SelectedBookings = () => {
    return (
        <div className="bookings-container">
            <Header />
            <main className="landing-main">
                <div className="content-wrapper">
                    <CalendarEvent 
                        number="05"
                        month="Month"
                        professorName="professor name"
                        time="00:00 - 00:00"
                    />
                    <CalendarEvent 
                        number="05"
                        month="Month"
                        professorName="professor name"
                        time="00:00 - 00:00"
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SelectedBookings;