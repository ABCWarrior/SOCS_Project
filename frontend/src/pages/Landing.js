import React from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { Search } from 'lucide-react'; // Adding lucide-react for the search icon
import '../styles/Landing.css';

const Landing = () => {
    return (
        <div className="landing-container">
            <Header />
            <main className="landing-main">
                <div className="content-wrapper">
                    <h1><i>Book a Meeting with your Prof!</i></h1>
                    <div className="search-bar">
                        <div className="search-input-container">
                            <Search className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Enter code" 
                                className="search-input"
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Landing;