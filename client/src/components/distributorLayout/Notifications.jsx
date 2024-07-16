import React, { useEffect, useRef, useState } from 'react';
import { createNotification, deleteNotificationById, getAllNotifications, updateNotificationById } from '../../utils/api';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { MdDelete, MdEdit } from 'react-icons/md';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [notificationData, setNotificationData] = useState({
        notificationHeading: '',
        notificationMessage: '',
        active: false // Add active status
    });
    const [notificationErrors, setNotificationErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [notificationId, setNotificationId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const formRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getAllNotifications();
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data.data)) {
                    const sortedNotifications = data.data.sort((a, b) => a.notificationHeading.localeCompare(b.notificationHeading));
                    setNotifications(sortedNotifications);
                } else {
                    console.error('Expected an array but got:', data);
                    setNotifications([]); // Set notifications to empty array if response is not an array
                }
            } else {
                console.error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotificationData({ ...notificationData, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const validateNotification = () => {
        const errors = {};
        if (!notificationData.notificationHeading) errors.notificationHeading = 'Notification heading is required';
        if (!notificationData.notificationMessage) errors.notificationMessage = 'Notification message is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateNotification();

        if (Object.keys(errors).length > 0) {
            setNotificationErrors(errors);
            return;
        }

        setNotificationErrors({});
        try {
            let response;
            if (isEditMode) {
                response = await updateNotificationById(notificationId, notificationData);
            } else {
                response = await createNotification(notificationData);
            }

            const responseData = await response.json();

            if (response.ok) {
                if (isEditMode) {
                    setShowUpdateAlert(true);
                    setShowSuccessAlert(false);
                } else {
                    setShowUpdateAlert(false);
                    setShowSuccessAlert(true);
                }
                setNotificationData({
                    notificationHeading: '',
                    notificationMessage: '',
                    active: false // Reset active status
                });
                setNotificationId(null);
                fetchNotifications(); // Fetch notifications again to update the list after adding/updating a notificationHeading
                setIsEditMode(false);
            } else {
                console.error('Error:', responseData);
                setShowErrorAlert(true);
                setNotificationErrors({ server: responseData.message });
            }
        } catch (err) {
            console.error('Error in try block:', err);
            setShowErrorAlert(true);
            setNotificationErrors({ server: `An error occurred. Please try again. ${err.message}` });
        }
    };

    const handleEdit = (notification) => {
        setNotificationData({
            notificationHeading: notification.notificationHeading,
            notificationMessage: notification.notificationMessage,
            active: notification.active // Set active status
        });
        setIsEditMode(true);
        setNotificationId(notification._id);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
    };

    const handleDelete = async (notification) => {
        try {
            const response = await deleteNotificationById(notification._id);
            if (response.ok) {
                alert("Notification Deleted Successfully");
                fetchNotifications(); // Refresh the notifications list after deletion
            } else {
                console.error('Failed to delete notification');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleCheckboxChange = async (notification) => {
        const updatedNotification = {
            ...notification,
            active: !notification.active // Toggle active status
        };

        try {
            const response = await updateNotificationById(notification._id, updatedNotification);
            if (response.ok) {
                fetchNotifications(); // Fetch notifications again to update the list
                alert("The notification status has been updated");
            } else {
                console.error('Failed to update notification');
            }
        } catch (error) {
            console.error('Error updating notification:', error);
        }
    };

    // Filtered notifications based on search query
    const filteredNotifications = notifications.filter((notification) =>
        notification.notificationHeading.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Container className="container-1" ref={formRef}>
                <div className="form form-2">
                    <h2 className="text-center mb-4">{isEditMode ? 'Edit Notification' : 'Add Notification'}</h2>
                    {showSuccessAlert && (
                        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                            Notification added successfully!
                        </Alert>
                    )}
                    {showUpdateAlert && (
                        <Alert variant="success" onClose={() => setShowUpdateAlert(false)} dismissible>
                            Notification updated successfully!
                        </Alert>
                    )}
                    {showErrorAlert && (
                        <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                            Failed to {isEditMode ? 'update' : 'add'} notification heading. {notificationErrors.server}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="notificationHeading" className="pb-4">
                                    <Form.Control
                                        className="large-input text-center"
                                        type="text"
                                        name="notificationHeading"
                                        value={notificationData.notificationHeading}
                                        onChange={handleChange}
                                        minLength="3"
                                        isInvalid={!!notificationErrors.notificationHeading}
                                        placeholder="Notification Heading"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {notificationErrors.notificationHeading}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Form.Group controlId="notificationMessage" className="pb-4">
                                    <Form.Control
                                        className="large-input text-center"
                                        type="text"
                                        name="notificationMessage"
                                        value={notificationData.notificationMessage}
                                        onChange={handleChange}
                                        isInvalid={!!notificationErrors.notificationMessage}
                                        placeholder="Notification Message"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {notificationErrors.notificationMessage}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" className="mt-2 signup-button">
                            {isEditMode ? 'Update' : 'Add'}
                        </Button>
                    </Form>
                </div>
            </Container>

            <Container className="container-1">
                <div className="list-container scrollable-list">
                    <Row>
                        <Col xs={12} sm={8}>
                            <h2 className="mb-4">List of Notifications</h2>
                        </Col>
                        <Col xs={12} sm={4}>
                            <Form.Group controlId="search" >
                                <Form.Control
                                    type="text"
                                    placeholder="Search by Notification Heading"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="table-header pb-2 pt-2 GuestHeader">
                        <Col xs={12} sm={1} className="text-center">
                            Sl. No.
                        </Col>
                        <Col xs={12} sm={3} className="text-center">
                            Notification Heading
                        </Col>
                        <Col xs={12} sm={3} className="text-center">
                            Notification Message
                        </Col>
                        <Col xs={12} sm={1} className="text-center">
                            Active
                        </Col>
                        <Col xs={12} sm={3} className="text-center">
                            Actions
                        </Col>
                    </Row>

                    {filteredNotifications.map((notification, index) => (
                        <Row key={index} className="table-row" onMouseEnter={(e) => e.currentTarget.classList.add('hovered')} onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}>
                            <Col xs={12} sm={1} className="text-center">
                                {index + 1}
                            </Col>
                            <Col xs={12} sm={3} className="text-center">
                                {notification.notificationHeading}
                            </Col>
                            <Col xs={12} sm={3} className="text-center">
                                {notification.notificationMessage}
                            </Col>
                            <Col xs={12} sm={1} className="text-center">
                                <Form.Check
                                    type="checkbox"
                                    checked={notification.active}
                                    onChange={() => handleCheckboxChange(notification)}
                                />
                            </Col>
                            <Col xs={6} sm={2} className="text-center">
                                <Button variant="primary" type="button" className="mt-2 signup-button" onClick={() => handleEdit(notification)}>
                                    Edit <MdEdit />
                                </Button>
                            </Col>
                            <Col xs={6} sm={2} className="text-center">
                                <Button variant="primary" type="button" className="mt-2 signup-button" onClick={() => handleDelete(notification)}>
                                    Delete <MdDelete />
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Notifications;
