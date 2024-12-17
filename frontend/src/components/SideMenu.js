import React from "react";
import "../styles/SideMenu.css"; // Add your styling here

function Sidebar() {
  return (
    <div className="sidebar">
      <button className="SideMenu-button active">myBookings</button>
      <button className="SideMenu-button">Book</button>
      <button className="SideMenu-button">Create</button>
      <button className="SideMenu-button">Request</button>
    </div>
  );
}

export default Sidebar;