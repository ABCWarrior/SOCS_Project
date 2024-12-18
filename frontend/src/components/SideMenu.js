import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/SideMenu.css"; // Add your styling here

function Sidebar() {
    return (
        <div className="SideMenu">
            <NavLink
                to="/mybookings"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                myBookings
            </NavLink>

            <NavLink
                to="/myrequests"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                myRequests
            </NavLink>

            <NavLink
                to="/create"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                Create
            </NavLink>

            {/* <NavLink
                to="/modify"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                Modify Bookings
            </NavLink> */}

            {/* <NavLink
                to="/bookings"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                Book
            </NavLink> */}

            {/* <NavLink
                to="/request"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                Request
            </NavLink> */}
        </div>
    );
}

export default Sidebar;