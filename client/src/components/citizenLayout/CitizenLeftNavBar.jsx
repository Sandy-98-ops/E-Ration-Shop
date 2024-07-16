import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import GuestFooter from '../guestLayout/GuestFooter';
import StudentHeader from './CitizenHeader';
import CitizenHeader from './CitizenHeader';

const CitizenLeftNavBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isCollapsed ? '☰' : '✖'}
            </button>
            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <NavLink to="/citizen/issuedRationList">Issued Ration List</NavLink>
                <NavLink to="/citizen/viewNotifications">Notifications</NavLink>

            </div>
            <div className={`content ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="GuestLayout">
                    <div className="GuestHeader">
                        <CitizenHeader />
                    </div>
                    <div className="Outlet">
                        <Outlet />
                    </div>
                    <div className="GuestFooter">
                        <GuestFooter />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CitizenLeftNavBar;
