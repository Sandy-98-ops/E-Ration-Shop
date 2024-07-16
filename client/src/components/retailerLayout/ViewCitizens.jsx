import React, { useEffect, useState } from 'react';
import { approveApplication, getAllCitizens, rejectApplication } from '../../utils/api'; // Update with actual API functions
import { useRetailerData } from '../../utils/Cookies';
import { Button, Col, Container, Row, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';

const ViewCitizens = () => {

    const { retailer: initialData } = useRetailerData();
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [citizens, setCitizens] = useState([]);

    useEffect(() => {
        getCitizensList(); // Fetch the list of retailers when the component mounts
    }, [initialData]);



    const getCitizensList = async () => {
        try {
            const response = await getAllCitizens();
            if (response.ok) {
                const data = await response.json();
                setCitizens(data);
            } else {
                console.error('Failed to fetch citizens');
            }
        } catch (error) {
            console.error('Error fetching citizens:', error);
        }
    }

    const viewApplication = (citizen) => {
        setSelectedApplication(citizen);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleApprove = async (selectedApplication) => {
        try {
            // Example: Call an API function to approve citizen
            const response = await approveApplication(selectedApplication._id);
            if (response.ok) {
                // Update citizen status or fetch updated data
                alert("Status updated successfully")

                getCitizensList();
                handleClose();
            } else {
                console.error('Failed to approve citizen');
            }
        } catch (error) {
            console.error('Error approving citizen:', error);
        }
    };

    const handleReject = async (selectedApplication) => {
        try {
            console.log(selectedApplication._id)

            // Example: Call an API function to reject citizen
            const response = await rejectApplication(selectedApplication._id);
            if (response.ok) {
                // Update citizen status or fetch updated data
                alert("Status updated successfully")
                getCitizensList();
                handleClose();
            } else {
                console.error('Failed to reject citizen');
            }
        } catch (error) {
            console.error('Error rejecting citizen:', error);
        }
    };

    const fileBasePath = 'http://localhost:7000/'; // Adjust based on your backend configuration
    const formatDate = (date) => {
        const formatDate = new Date(date);

        return format(formatDate, 'dd-MM-yyyy');
    }

    return (
        <div>
            <Container className="container-1">
                <div className="list-container scrollable-list">
                    <Row>
                        <Col xs={12} sm={8}>
                            <h2 className="mb-4">Citizen List</h2>
                        </Col>
                    </Row>

                    <Row className="table-header pb-2 pt-2 GuestHeader">
                        <Col xs={12} sm={1} className="text-center">Sl. No.</Col>
                        <Col xs={12} sm={2} className="text-center">Name</Col>
                        <Col xs={12} sm={2} className="text-center">Ration Card No</Col>
                        <Col xs={12} sm={2} className="text-center">Mobile No</Col>
                        <Col xs={12} sm={3} className="text-center">Address</Col>
                        <Col xs={12} sm={2} className="text-center">Date Of Birth</Col>
                    </Row>

                    {citizens.map((citizen, index) => (
                        (citizen.passStatus !== 'Rejected By Institute') &&
                        <Row key={index} className="table-row">
                            <Col xs={12} sm={1} className="text-center">{index + 1}</Col>
                            <Col xs={12} sm={2} className="text-center">{citizen.firstName} {citizen.lastName}</Col>
                            <Col xs={12} sm={2} className="text-center">{citizen.rationCardNo}</Col>
                            <Col xs={12} sm={2} className="text-center">{citizen.mobile}</Col>
                            <Col xs={12} sm={3} className="text-center">{citizen.address}</Col>
                            <Col xs={12} sm={2} className="text-center">{formatDate(citizen.dateOfBirth)}</Col>
                        </Row>
                    ))}
                </div>
            </Container >

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

export default ViewCitizens
