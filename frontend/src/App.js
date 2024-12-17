import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import SelectedBookings from './pages/SelectedBookings';
import MyBookings from './pages/myBooking';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={<SelectedBookings />} />
          <Route path="/mybookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;