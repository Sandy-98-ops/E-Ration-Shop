import React, { useEffect, useState } from 'react';
import { approveApplication, getAllCitizens, getSalesByRetailer, rejectApplication } from '../../utils/api'; // Update with actual API functions
import { useRetailerData } from '../../utils/Cookies';
import { Button, Col, Container, Row, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';

const ViewSale = () => {

    const { retailer: initialData } = useRetailerData();

    const fileBasePath = 'http://localhost:7000/'; // Adjust based on your backend configuration

    const [sales, setSales] = useState([]);
    const [citizens, setCitizens] = useState([]);

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [rationCardNumber, setRationCardNumber] = useState('');
    const [filteredSales, setFilteredSales] = useState(sales);

    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        getSaleByRetailer();
        getCitizensList(); // Fetch the list of retailers when the component mounts
    }, [initialData]);

    const getSaleByRetailer = async () => {
        try {
            const response = await getSalesByRetailer(initialData._id);
            if (response.ok) {
                const data = await response.json();
                setSales(data);
            } else {
                console.error('Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const getCitizensList = async () => {
        try {
            const response = await getAllCitizens();
            if (response.ok) {
                const data = await response.json();
                setCitizens(data);
            } else {
                console.error('Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    }

    const viewApplication = (sales) => {
        setSelectedApplication(sales);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleApprove = async (selectedApplication) => {
        try {
            // Example: Call an API function to approve sales
            const response = await approveApplication(selectedApplication._id);
            if (response.ok) {
                // Update sales status or fetch updated data
                alert("Status updated successfully")

                getSalesByRetailer();
                handleClose();
            } else {
                console.error('Failed to approve sales');
            }
        } catch (error) {
            console.error('Error approving sales:', error);
        }
    };

    const handleReject = async (selectedApplication) => {
        try {
            console.log(selectedApplication._id)

            // Example: Call an API function to reject sales
            const response = await rejectApplication(selectedApplication._id);
            if (response.ok) {
                // Update sales status or fetch updated data
                alert("Status updated successfully")
                getSalesByRetailer();
                handleClose();
            } else {
                console.error('Failed to reject sales');
            }
        } catch (error) {
            console.error('Error rejecting sales:', error);
        }
    };

    const getCitizenById = (citizenId) => {
        const citizen = citizens.find(r => r._id === citizenId);
        return citizen ? `${citizen.firstName}  ${citizen.lastName}` : '-';
    };

    const getCitizenRationCardNo = (citizenId) => {
        const citizen = citizens.find(r => r._id === citizenId);
        return citizen ? citizen.rationCardNo : '-';
    };

    const formatDate = (date) => {
        const formatDate = new Date(date);

        return format(formatDate, 'MMM yyyy');
    }

    useEffect(() => {
        setFilteredSales(sales);
    }, [sales]);

    const handleSearch = () => {
        const filtered = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            const saleYear = saleDate.getFullYear();
            const saleMonth = saleDate.getMonth() + 1; // Months are 0-based

            const citizenRationCardNo = getCitizenRationCardNo(sale.citizen);

            return (
                (!year || saleYear === parseInt(year)) &&
                (!month || saleMonth === parseInt(month)) &&
                (!rationCardNumber || citizenRationCardNo.includes(rationCardNumber))
            );
        });
        setFilteredSales(filtered);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    const handleRationCardNumberChange = (event) => {
        setRationCardNumber(event.target.value);
    };

    return (
        <div>
            <Container className="container-1">
                <div className="list-container scrollable-list">
                    <Row>
                        <Col xs={12} sm={2}>
                            <h2 className="mb-4">Sale</h2>
                        </Col>
                        <Col sm={2}>
                            <Form.Control as="select" value={year} onChange={handleYearChange}>
                                <option value="">Select Year</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </Form.Control>
                        </Col>
                        <Col sm={2}>
                            <Form.Control as="select" value={month} onChange={handleMonthChange}>
                                <option value="">Select Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </Form.Control>
                        </Col>
                        <Col sm={4}>
                            <Form.Control
                                type="text"
                                placeholder="Enter Ration Card Number"
                                value={rationCardNumber}
                                onChange={handleRationCardNumberChange}
                            />
                        </Col>
                        <Col sm={2}>
                            <Button onClick={handleSearch}>Search</Button>
                        </Col>
                    </Row>

                    <Row className="table-header pb-2 pt-2 GuestHeader">
                        <Col xs={12} sm={1} className="text-center">Sl. No.</Col>
                        <Col xs={12} sm={2} className="text-center">Name</Col>
                        <Col xs={12} sm={3} className="text-center">Ration Card</Col>
                        <Col xs={12} sm={1} className="text-center">Month</Col>
                        <Col xs={12} sm={2} className="text-center">Rice</Col>
                        <Col xs={12} sm={1} className="text-center">Wheat</Col>
                        <Col xs={12} sm={2} className="text-center">Sugar</Col>
                    </Row>

                    {filteredSales.map((sale, index) => (
                        <Row key={index} className="table-row">
                            <Col xs={12} sm={1} className="text-center">{index + 1}</Col>
                            <Col xs={12} sm={2} className="text-center">{getCitizenById(sale.citizen)}</Col>
                            <Col xs={12} sm={3} className="text-center">{getCitizenRationCardNo(sale.citizen)}</Col>
                            <Col xs={12} sm={1} className="text-center">{formatDate(sale.date)}</Col>
                            <Col xs={12} sm={2} className="text-center">{sale.rice}</Col>
                            <Col xs={12} sm={1} className="text-center">{sale.wheat}</Col>
                            <Col xs={12} sm={2} className="text-center">{sale.sugar}</Col>
                        </Row>
                    ))}
                </div>
            </Container>

            {selectedApplication && (
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Application Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col xs={12} sm={6}>
                                    <Form.Group controlId="firstName" className="pb-4">
                                        <Form.Control
                                            className="large-input"
                                            type="text"
                                            name="firstName"
                                            value={selectedApplication.firstName}
                                            readOnly
                                            placeholder="First Name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Group controlId="lastName" className="pb-4">
                                        <Form.Control
                                            className="large-input"
                                            type="text"
                                            name="lastName"
                                            value={selectedApplication.lastName}
                                            readOnly
                                            placeholder="Last Name"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId="address" className="pb-4">
                                <Form.Control
                                    className="large-input"
                                    type="text"
                                    name="address"
                                    value={selectedApplication.address}
                                    readOnly
                                    placeholder="Address"
                                />
                            </Form.Group>

                            <Row>
                                <Col xs={12} sm={4}>
                                    <Form.Group controlId="course" className="pb-4">
                                        <Form.Control
                                            className="large-input"
                                            type="text"
                                            name="course"
                                            value={selectedApplication.course}
                                            readOnly
                                            placeholder="Course"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={4}>
                                    <Form.Group controlId="from" className="pb-4">
                                        <Form.Control
                                            className="large-input"
                                            type="text"
                                            name="from"
                                            value={selectedApplication.from}
                                            readOnly
                                            placeholder="From"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={4}>
                                    <Form.Group controlId="to" className="pb-4">
                                        <Form.Control
                                            className="large-input"
                                            type="text"
                                            name="to"
                                            value={selectedApplication.to}
                                            readOnly
                                            placeholder="To"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={3}>
                                    Photo:
                                </Col>
                                <Col xs={12} sm={9}>
                                    {selectedApplication.photo && (
                                        <a href={`${fileBasePath}${selectedApplication.photo}`} target="_blank" rel="noopener noreferrer" download>Download Photo</a>
                                    )}
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={3}>
                                    Aadhar Card:
                                </Col>
                                <Col xs={12} sm={9}>
                                    {selectedApplication.aadharCard && (
                                        <a href={`${fileBasePath}${selectedApplication.aadharCard}`} target="_blank" rel="noopener noreferrer" download>Download Aadhar Card</a>
                                    )}
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={3}>
                                    Fee Receipt:
                                </Col>
                                <Col xs={12} sm={9}>
                                    {selectedApplication.collegeRecipt && (
                                        <a href={`${fileBasePath}${selectedApplication.collegeRecipt}`} target="_blank" rel="noopener noreferrer" download>Download Fee Receipt</a>
                                    )}
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div >
    );
}

export default ViewSale
