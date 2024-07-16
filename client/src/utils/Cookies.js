import { useState } from 'react';
import Cookies from 'js-cookie';

const retailerData = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    location: '',
    ward: '',
    password: ''
};

export const useRetailerData = () => {
    const [retailer, setRetailer] = useState(() => {
        const retailer = Cookies.get('retailerData');
        if (retailer) {
            try {
                console.log("Got Cookie and returning back")
                return JSON.parse(retailer);
            } catch (error) {
                console.error('Error parsing retailerData cookie:', error);
                return retailerData; // Fallback to default if parsing fails
            }
        }
        return retailerData; // Return default if cookie doesn't exist
    });

    const updateUserData = (newUserData) => {
        setRetailer(newUserData);
        Cookies.set('retailerData', JSON.stringify(newUserData));
    };

    return { retailer, updateUserData };
};


const citizenData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    institute: ''
};

export const useCitizenData = () => {
    const [citizen, setCitizen] = useState(() => {
        const data = Cookies.get('citizenData');
        if (data) {
            try {
                console.log("Got Cookie and returning back")
                return JSON.parse(data);
            } catch (error) {
                console.error('Error parsing retailerData cookie:', error);
                return citizenData; // Fallback to default if parsing fails
            }
        }
        return citizenData; // Return default if cookie doesn't exist
    });

    const updateInstituteData = (newUserData) => {
        setCitizen(newUserData);
        Cookies.set('citizenData', JSON.stringify(newUserData));
    };

    return { citizen, setCitizen };
};
