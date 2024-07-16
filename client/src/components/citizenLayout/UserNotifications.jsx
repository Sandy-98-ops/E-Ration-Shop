import React, { useEffect, useState } from 'react';
import { getAllNotifications } from '../../utils/api';
import { Col, Container, Row, Form } from 'react-bootstrap';

const UserNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filtered notifications based on search query and active status
    const filteredNotifications = notifications.filter((notification) =>
        notification.active && notification.notificationHeading.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
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
                        <Col xs={12} sm={2} className="text-center">
                            Sl. No.
                        </Col>
                        <Col xs={12} sm={5} className="text-center">
                            Notification Heading
                        </Col>
                        <Col xs={12} sm={5} className="text-center">
                            Notification Message
                        </Col>
                    </Row>

                    {filteredNotifications.map((notification, index) => (
                        <Row key={index} className="table-row" onMouseEnter={(e) => e.currentTarget.classList.add('hovered')} onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}>
                            <Col xs={12} sm={2} className="text-center">
                                {index + 1}
                            </Col>
                            <Col xs={12} sm={5} className="text-center">
                                {notification.notificationHeading}
                            </Col>
                            <Col xs={12} sm={5} className="text-center">
                                {notification.notificationMessage}
                            </Col>
                        </Row>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default UserNotifications;
