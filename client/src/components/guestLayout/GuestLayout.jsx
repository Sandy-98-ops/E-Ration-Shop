import React from 'react'
import GuestHeader from './GuestHeader'
import { Outlet } from 'react-router-dom'
import GuestFooter from './GuestFooter'

const GuestLayout = () => {
    return (
        <div className="GuestLayout">
            <div className="GuestHeader">
                <GuestHeader />
            </div>
            <div className="Outlet">
                <Outlet />
            </div>
            <div className="GuestFooter">
                <GuestFooter />
            </div>
        </div>


    )
}

export default GuestLayout
