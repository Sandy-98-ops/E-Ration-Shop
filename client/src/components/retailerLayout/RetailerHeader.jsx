import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { FaUserEdit } from "react-icons/fa";
import { PiPasswordLight } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import Cookies from 'js-cookie';
import { useRetailerData } from '../../utils/Cookies';

const RetailerHeader = () => {
    const navigate = useNavigate();

    const {retailer : initalData} = useRetailerData();

    const handleSelect = (eventKey) => {
        switch (eventKey) {
            case 'edit-profile':
                navigate('/retailer/edit-profile');
                break;
            case 'change-password':
                navigate('/retailer/change-password');
                break;
            case 'logout':
                // Clear cookies
                Cookies.remove('instituteData');
                // Clear session storage
                sessionStorage.clear();
                // Clear local storage if needed
                localStorage.clear();
                // Navigate to login and replace history
                navigate('/', { replace: true });
                // Use window.location.replace to ensure no back navigation
                window.location.replace('/');
                break;
            default:
                break;
        }
    };

    return (
        <div className="d-flex justify-content-end p-3">

            <h3>{initalData.ward}</h3> &nbsp;&nbsp;
            <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle>
                    Profile <CgProfile />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="edit-profile">
                        Edit Profile <FaUserEdit />
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="change-password">
                        Change Password <PiPasswordLight />
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="logout">
                        Logout <MdLogout />
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default RetailerHeader
