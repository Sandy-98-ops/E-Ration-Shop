import React, { useEffect, useState } from 'react';
import { getInstitutePassApplications, approveApplication, rejectApplication } from '../../utils/api'; // Update with actual API functions
import { useInstituteData } from '../../utils/Cookies';
import { Button, Col, Container, Row, Modal, Form } from 'react-bootstrap';

const ViewApplications = () => {

    const { retailer: initalData } = useRetailerData();

    const [applications, setApplications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        getAllApplications();
    }, []);

    const getAllApplications = async () => {
        try {
            const response = await getInstitutePassApplications(initialData._id);
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                console.error('Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const viewApplication = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleApprove = async (selectedApplication) => {
        try {
            // Example: Call an API function to approve application
            const response = await approveApplication(selectedApplication._id);
            if (response.ok) {
                // Update application status or fetch updated data
                alert("Status updated successfully")

                getAllApplications();
                handleClose();
            } else {
                console.error('Failed to approve application');
            }
        } catch (error) {
            console.error('Error approving application:', error);
        }
    };

    const handleReject = async (selectedApplication) => {
        try {
            console.log(selectedApplication._id)

            // Example: Call an API function to reject application
            const response = await rejectApplication(selectedApplication._id);
            if (response.ok) {
                // Update application status or fetch updated data
                alert("Status updated successfully")
                getAllApplications();
                handleClose();
            } else {
                console.error('Failed to reject application');
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
        }
    };

    const fileBasePath = 'http://localhost:7000/'; // Adjust based on your backend configuration

    return (
        <div>
            <Container className="container-1">
                <div className="list-container scrollable-list">
                    <Row>
                        <Col xs={12} sm={8}>
                            <h2 className="mb-4">Applications</h2>
                        </Col>
                    </Row>

                    <Row className="table-header pb-2 pt-2 GuestHeader">
                        <Col xs={12} sm={1} className="text-center">Sl. No.</Col>
                        <Col xs={12} sm={2} className="text-center">Name</Col>
                        <Col xs={12} sm={2} className="text-center">From</Col>
                        <Col xs={12} sm={2} className="text-center">To</Col>
                        <Col xs={12} sm={2} className="text-center">Status</Col>
                        <Col xs={12} sm={3} className="text-center">Actions</Col>
                    </Row>

                    {applications.map((application, index) => (
                        (application.passStatus !== 'Rejected By Institute') &&
                        <Row key={index} className="table-row">
                            <Col xs={12} sm={1} className="text-center">{index + 1}</Col>
                            <Col xs={12} sm={2} className="text-center">{application.firstName} {application.lastName}</Col>
                            <Col xs={12} sm={2} className="text-center">{application.from}</Col>
                            <Col xs={12} sm={2} className="text-center">{application.to}</Col>
                            <Col xs={12} sm={2} className="text-center">{application.passStatus}</Col>
                            <Col xs={12} sm={1} className="text-center">
                                <Button variant="primary" onClick={() => viewApplication(application)}>View</Button>
                            </Col>
                            <Col xs={12} sm={1} className="text-center">
                                {(application.passStatus !== 'Approved By Institute')
                                    && (<Button variant="success" onClick={() => handleApprove(application)}>Approve</Button>)}

                            </Col>

                            <Col xs={12} sm={1} className="text-center">

                                {(application.passStatus !== 'Approved By Institute')
                                    && (<Button variant="danger" onClick={() => handleReject(application)}>Reject</Button>)}
                            </Col>
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
};

export default ViewApplications;
