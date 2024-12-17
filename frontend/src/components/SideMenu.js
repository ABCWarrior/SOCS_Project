import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/SideMenu.css"; // Add your styling here

function Sidebar() {
    return (
        <div className="SideMenu">
            <NavLink
                to="/myBookings"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                myBookings
            </NavLink>

            {/* <NavLink
                to="/book"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                Book
            </NavLink> */}

            <NavLink
                to="/create"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                Create
            </NavLink>

            <NavLink
                to="/request"
                className={({ isActive }) =>
                    isActive ? "SideMenu-button active" : "SideMenu-button"
                }
                >
                Request
            </NavLink>
        </div>
    );
}

export default Sidebar;