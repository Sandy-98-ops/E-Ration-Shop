import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import GuestFooter from '../guestLayout/GuestFooter';
import RetailerHeader from './RetailerHeader';

const RetailerLeftNavBar = () => {
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
                <NavLink to="/retailer/sale">Sale</NavLink>
                <NavLink to="/retailer/saleList">View Sale</NavLink>
                <NavLink to="/retailer/citizenList">View Citizens</NavLink>
                <NavLink to="/retailer/stockList">Stock Details</NavLink>
            </div>
            <div className={`content ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="GuestLayout">
                    <div className="GuestHeader">
                        <RetailerHeader />
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

export default RetailerLeftNavBar;
