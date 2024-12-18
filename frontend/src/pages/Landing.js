import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { Search } from 'lucide-react'; 
import '../styles/Landing.css';

const Landing = () => {
    const [searchCode, setSearchCode] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/bookings/${searchCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('selectedBooking', JSON.stringify(data.booking));
                navigate('/selected-bookings');
            } else {
                alert(data.message || 'Can\'t find booking');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('An error occurred while searching for the booking');
        }
    };

    return (
        <div className="landing-container">
            <Header />
            <main className="landing-main">
                <div className="content-wrapper">
                    <h1><i>Book a Meeting with your Prof!</i></h1>
                    <form onSubmit={handleSearch} className="search-bar"
                    style={{ 
                        width: "500px",
                        display: "flex",
                        border: "none"
                    }}>
                        <div className="search-input-container">
                            <Search className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Enter code" 
                                className="search-input"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Landing;