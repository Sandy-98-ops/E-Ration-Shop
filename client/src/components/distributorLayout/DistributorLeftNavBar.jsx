import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import GuestFooter from '../guestLayout/GuestFooter';
import DistributorHeader from './DistributorHeader';

const DisgtributorLeftNavBar = () => {
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
                <NavLink to="/distributor/addRetailer">Add Retailer</NavLink>
                <NavLink to="/distributor/retailersList">Retailers List</NavLink>
                <NavLink to="/distributor/addItem">Add Items</NavLink>
                <NavLink to="/distributor/itemsList">Items List</NavLink>
                <NavLink to="/distributor/issueStock">Issue Stock</NavLink>
                <NavLink to="/distributor/viewIssuedStocks">Issued Stock List</NavLink>
                <NavLink to="/distributor/setNotification">Notifications</NavLink>
            </div>
            <div className={`content ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="GuestLayout">
                    <div className="GuestHeader">
                        <DistributorHeader />
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

export default DisgtributorLeftNavBar;
