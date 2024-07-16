const API_URL = 'http://localhost:7000';

const apiRequest = async (endpoint, method = 'GET', data = null) => {
    const url = `${API_URL}${endpoint}`;
    const options = { method };

    if (data) {
        options.body = data instanceof FormData ? data : JSON.stringify(data);
        if (!(data instanceof FormData)) {
            options.headers = { 'Content-Type': 'application/json' };
        }
    }

    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        console.log(error)
        throw new Error(`An error occurred while processing your request : ${error}`);
    }
};


export const citizenRegister = (signupData) => {
    return apiRequest('/citizen/create', 'POST', signupData);
};

export const getCitizensByRetailer = (retailer) => {
    return apiRequest(`/citizen/getCitizensByRetailerId/${retailer}`, 'GET');
}

export const getAllCitizens = () => {
    return apiRequest('/citizen/', 'GET');
}


export const userLogin = (loginData) => {
    return apiRequest('/citizen/login', 'POST', loginData)
}

export const getCitizensByRationCardNumberAndRetailer = async (rationCardNo, retailer) => {
    return await apiRequest(`/citizen/getCitizensByRationCardNumberAndRetailer`, 'POST', { rationCardNo, retailer });
};

export const issueRation = (data) => {
    return apiRequest(`/sale/create`, 'POST', data);
}

export const getSalesByRetailer = (retailer) => {
    return apiRequest(`/sale/getsaleByRetailer/${retailer}`, 'GET');
}

export const getSalesByCitizen = (citizen) => {
    return apiRequest(`/sale/getSaleByCitizen/${citizen}`, 'GET');
}

export const addRetailer = (signupData) => {
    return apiRequest('/retailer/create', 'POST', signupData);
};

export const retailerLogin = (loginData) => {
    return apiRequest('/retailer/login', 'POST', loginData);
};

export const getRetailers = () => {
    return apiRequest('/retailer/', 'GET');
}

export const updateRetailerDetails = (id, data) => {
    return apiRequest(`/retailer/updateById/${id}`, 'PUT', data);
}

export const deleteRetailerById = (id) => {
    return apiRequest(`/retailer/deleteById/${id}`, 'DELETE');
}


export const distributorLogin = (loginData) => {
    return apiRequest('/distributor/login', 'POST', loginData)
}

export const addItem = (data) => {
    return apiRequest('/items/create', 'POST', data)
}

export const getItemsList = () => {
    return apiRequest('/items/', 'GET');
}

export const getItemByReatiler = (retailer) => {
    return apiRequest(`/items/getItemsByRetailer/${retailer}`, 'GET');
}


export const updateItemDetails = (id, data) => {
    return apiRequest(`/items/updateById/${id}`, 'PUT', data);
}

export const deleteItemById = (id) => {
    return apiRequest(`/items/deleteById/${id}`, 'DELETE');
}


export const createStock = (data) => {
    return apiRequest('/stock/create', 'POST', data);
}

export const getAllStocks = () => {
    return apiRequest('/stock/', 'GET');
}

export const getAllStockByRetailer = (retailer) => {
    return apiRequest(`/stock/getStockByRetailer/${retailer}`, 'GET');
}

export const getAllStocksByRetailerId = (retailer) => {
    return apiRequest(`/stock/getAllStockByRetailer/${retailer}`, 'GET');
}

export const createNotification = (notificationData) => {
    return apiRequest('/notification/createNotification', 'POST', notificationData);
}

export const getAllNotifications = () => {
    return apiRequest('/notification', 'GET');
}

export const updateNotificationById = (id, updateNotificationData) => {
    return apiRequest(`/notification/updateNotificationById/${id}`, 'PUT', updateNotificationData);
}

export const deleteNotificationById = (id) => {
    return apiRequest(`/notification/deleteNotificationById/${id}`, 'DELETE')
}


// --------------------------------------------------------------------------------------


export const getAllDepos = () => {
    return apiRequest('/depo/', 'GET');
}

export const getAllInstitutes = () => {
    return apiRequest('/institute/', 'GET');
}

export const getInstituteById = (id) => {
    return apiRequest(`/institute/${id}`, 'GET');
}

export const studentPassApplication = (applicationData) => {
    return apiRequest('/pass-applications/upload', 'POST', applicationData);
}

export const getInstitutePassApplications = (id) => {
    return apiRequest(`/pass-applications/getInstitutePassApplications/${id}`, 'GET');
}

export const getPassApplications = () => {
    return apiRequest(`/pass-applications/`, 'GET');
}


export const approveApplication = (id) => {
    return apiRequest(`/pass-applications/instituteApproval/${id}`, 'PUT');
}

export const rejectApplication = (id) => {
    return apiRequest(`/pass-applications/instituteRejection/${id}`, 'PUT')
}

export const approveDepoApplication = (id) => {
    return apiRequest(`/pass-applications/depoApproval/${id}`, 'PUT');

}

export const rejectDepoApplication = (id) => {
    return apiRequest(`/pass-applications/depoRejection/${id}`, 'PUT');
}



