import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row, Form, Alert } from 'react-bootstrap';
import { getItemsList, getRetailers, deleteItemById, updateItemDetails } from '../../utils/api';

const ItemsList = () => {
    const [items, setItems] = useState([]);
    const [retailers, setRetailers] = useState([]); // State to store list of retailers
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setselectedItem] = useState(null);
    const [signupErrors, setSignupErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    useEffect(() => {
        getItems();
        getRetailersList(); // Fetch the list of retailers when the component mounts
    }, []);

    const getItems = async () => {
        try {
            const response = await getItemsList();
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            } else {
                console.error('Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const getRetailersList = async () => {
        try {
            const response = await getRetailers();
            if (response.ok) {
                const data = await response.json();
                setRetailers(data);
            } else {
                console.error('Failed to fetch retailers');
            }
        } catch (error) {
            console.error('Error fetching retailers:', error);
        }
    };

    const handleEdit = (item) => {
        setselectedItem(item);
        setShowModal(true);
    };

    const handleDelete = async (itemId) => {
        try {
            const response = await deleteItemById(itemId);
            if (response.ok) {
                alert("Item Deleted Successfully");
                getItems();
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
        setselectedItem(null);
        setShowModal(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateItemDetails(selectedItem._id, selectedItem);
            if (response.ok) {
                setItems(prevItems =>
                    prevItems.map(item =>
                        item._id === selectedItem._id ? selectedItem : item
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
        setselectedItem(prevRetailer => ({
            ...prevRetailer,
            [name]: value
        }));
    };

    // Helper function to get retailer's ward by ID
    const getRetailerWardById = (retailerId) => {
        const retailer = retailers.find(r => r._id === retailerId);
        return retailer ? retailer.ward : 'Ward Not Found';
    };

    return (
        <div>
            <Container className="container-1">
                <div className="list-container scrollable-list">
                    <Row>
                        <Col xs={12} sm={8}>
                            <h2 className="mb-4">Items List</h2>
                        </Col>
                    </Row>

                    {showSuccessAlert && (
                        <Alert variant="success">Item updated successfully!</Alert>
                    )}
                    {showErrorAlert && signupErrors.server && (
                        <Alert variant="danger">{signupErrors.server}</Alert>
                    )}

                    <Row className="table-header pb-2 pt-2 GuestHeader">
                        <Col xs={12} sm={1} className="text-center">Sl. No.</Col>
                        <Col xs={12} sm={2} className="text-center">Retailer Ward</Col>
                        <Col xs={12} sm={2} className="text-center">Rice</Col>
                        <Col xs={12} sm={2} className="text-center">Wheat</Col>
                        <Col xs={12} sm={2} className="text-center">Sugar</Col>
                        <Col xs={12} sm={3} className="text-center">Actions</Col>
                    </Row>

                    {items.map((item, index) => (
                        <Row key={index} className="table-row">
                            <Col xs={12} sm={1} className="text-center">{index + 1}</Col>
                            <Col xs={12} sm={2} className="text-center">{getRetailerWardById(item.retailer)}</Col>
                            <Col xs={12} sm={2} className="text-center">{item.rice}</Col>
                            <Col xs={12} sm={2} className="text-center">{item.wheat}</Col>
                            <Col xs={12} sm={2} className="text-center">{item.sugar}</Col>

                            <Col xs={12} sm={3} className="text-center">
                                <Button variant="warning" onClick={() => handleEdit(item)}>Edit</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                            </Col>
                        </Row>
                    ))}
                </div>
            </Container>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Item Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="college" className="pb-4">
                                <Form.Label>Select Ward</Form.Label>
                                <Form.Control
                                    className="large-input text-center right-align-options"
                                    as="select"
                                    name="retailer"
                                    value={selectedItem.retailer}
                                    onChange={handleInputChange}
                                    isInvalid={!!signupErrors.retailer}
                                >
                                    <option value="">Select Ward</option>
                                    {retailers.map((retailer) => (
                                        <option key={retailer._id} value={retailer._id}>
                                            {retailer.ward}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.retailer}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Rice</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="rice"
                                    value={selectedItem.rice}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="wheat">
                                <Form.Label>Wheat</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="wheat"
                                    value={selectedItem.wheat}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="sugar">
                                <Form.Label>Sugar</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="sugar"
                                    value={selectedItem.sugar}
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

export default ItemsList;
