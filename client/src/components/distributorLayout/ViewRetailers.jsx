import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row, Form, Alert } from 'react-bootstrap';
import { deleteRetailerById, getRetailers, updateRetailerDetails } from '../../utils/api';

const ViewRetailers = () => {
    const [retailers, setRetailers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRetailer, setselectedRetailer] = useState(null);
    const [signupErrors, setSignupErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    useEffect(() => {
        getRetailersList();
    }, []);

    const getRetailersList = async () => {
        try {
            const response = await getRetailers();
            if (response.ok) {
                const data = await response.json();
                console.log(retailers)
                setRetailers(data);

            } else {
                console.error('Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const handleEdit = (retailer) => {
        setselectedRetailer(retailer);
        setShowModal(true);
    };

    const handleDelete = async (retailerId) => {

        try {
            const response = await deleteRetailerById(retailerId);
            if (response.ok) {
                alert("Scheme Deleted Successfully");
                getRetailersList();
            } else {
                setShowErrorAlert(true);
                setSignupErrors({ server: `An error occurred. Please try again.` });
            }

        } catch (err) {
            setShowErrorAlert(true);
            setSignupErrors({ server: `An error occurred. Please try again. ${err.message}` });
        }
    }

    const handleModalClose = () => {
        setselectedRetailer(null);
        setShowModal(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateRetailerDetails(selectedRetailer._id, selectedRetailer);
            if (response.ok) {
                // Update the retailer in the state
                setRetailers(prevSchemes =>
                    prevSchemes.map(retailer =>
                        retailer._id === selectedRetailer._id ? selectedRetailer : retailer
                    )
                );
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
                handleModalClose();
            } else {
                setShowErrorAlert(true);
                setSignupErrors({ server: `An error occurred. Please try again.` });
            }
        } catch (err) {
            setShowErrorAlert(true);
            setSignupErrors({ server: `An error occurred. Please try again. ${err.message}` });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setselectedRetailer(prevScheme => ({
            ...prevScheme,
            [name]: value
        }));
    };

    return (
        <div>
            <Container className="container-1">
                <div className="list-container scrollable-list">
                    <Row>
                        <Col xs={12} sm={8}>
                            <h2 className="mb-4">Retailers List</h2>
                        </Col>
                    </Row>

                    {showSuccessAlert && (
                        <Alert variant="success">Retailer updated successfully!</Alert>
                    )}
                    {showErrorAlert && signupErrors.server && (
                        <Alert variant="danger">{signupErrors.server}</Alert>
                    )}

                    <Row className="table-header pb-2 pt-2 GuestHeader">
                        <Col xs={12} sm={1} className="text-center">Sl. No.</Col>
                        <Col xs={12} sm={2} className="text-center">Name</Col>
                        <Col xs={12} sm={2} className="text-center">Mobile</Col>
                        <Col xs={12} sm={2} className="text-center">Location</Col>
                        <Col xs={12} sm={2} className="text-center">Ward</Col>

                        <Col xs={12} sm={3} className="text-center">Actions</Col>
                    </Row>

                    {retailers.map((retailer, index) => (
                        <Row key={index} className="table-row">
                            <Col xs={12} sm={1} className="text-center">{index + 1}</Col>
                            <Col xs={12} sm={2} className="text-center">{retailer.firstName} {retailer.lastName}</Col>
                            <Col xs={12} sm={2} className="text-center">{retailer.mobile}</Col>
                            <Col xs={12} sm={2} className="text-center">{retailer.location}</Col>
                            <Col xs={12} sm={2} className="text-center">{retailer.ward}</Col>

                            <Col xs={12} sm={3} className="text-center">
                                <Button variant="warning" onClick={() => handleEdit(retailer)}>Edit</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(retailer._id)}>Delete</Button>
                            </Col>
                        </Row>
                    ))}
                </div>
            </Container>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Retailer Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRetailer && (
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={selectedRetailer.firstName}
                                    onChange={handleInputChange}

                                />
                            </Form.Group>
                            <Form.Group controlId="benefits">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={selectedRetailer.lastName}
                                    onChange={handleInputChange}

                                />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    value={selectedRetailer.email}
                                    onChange={handleInputChange}

                                />
                            </Form.Group>
                            <Form.Group controlId="mobile">
                                <Form.Label>Phone No.</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="mobile"
                                    value={selectedRetailer.mobile}
                                    onChange={handleInputChange}

                                />
                            </Form.Group>
                            <Form.Group controlId="location">
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    value={selectedRetailer.location}
                                    onChange={handleInputChange}

                                />
                            </Form.Group>
                            <Form.Group controlId="ward">
                                <Form.Label>Ward</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ward"
                                    value={selectedRetailer.ward}
                                    onChange={handleInputChange}

                                />
                            </Form.Group>
                            <div className="d-flex justify-content-center mt-4">
                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ViewRetailers
