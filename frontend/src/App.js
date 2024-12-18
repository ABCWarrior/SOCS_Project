import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import SelectedBookings from './pages/SelectedBookings';
import MyBookings from './pages/myBookings';
import Create from './pages/Create';
import Request from './pages/Request';
import MyRequests from './pages/myRequests';
import Modify from './pages/Modify';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/selected-bookings" element={<SelectedBookings />} />
            <Route path="/mybookings" element={<MyBookings />} />
            <Route path="/create" element={<Create />} />
            <Route path="/request" element={<Request />} />
            <Route path="/myrequests" element={<MyRequests />} />
            <Route path="/modify" element={<Modify />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;