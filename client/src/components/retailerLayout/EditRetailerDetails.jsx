import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Container, Row, Alert } from 'react-bootstrap';
import { updateRetailerDetails, getAllDepos } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const EditRetailerDetails = () => {

    const navigate = useNavigate();

    const [depos, setDepos] = useState([]);

    const [signupData, setSignupData] = useState();


    const [signupErrors, setSignupErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    };

    const validateSignup = () => {
        const errors = {};
        if (!signupData.collegeName) errors.collegeName = 'Institute name is required';
        if (!signupData.collegeEmail) errors.collegeEmail = 'Email is required';
       
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateSignup();

        if (Object.keys(errors).length > 0) {
            setSignupErrors(errors);
            return;
        }

        setSignupErrors({});
        try {
            const { password, ...profileData } = signupData;

            const response = await updateRetailerDetails(profileData);
            if (response.ok) {
                alert('Profile updated successfully');
                Cookies.set('citizenData', JSON.stringify(profileData));
                navigate('/citizen');
            } else {
                setShowErrorAlert(true);
                const errorData = await response.json();
                setSignupErrors({ server: errorData.message });
            }
        } catch (err) {
            setShowErrorAlert(true);
            setSignupErrors({ server: `An error occurred. Please try again. ${err.message}` });
        }
    };

    useEffect(() => {
        fetchDepos();
    }, []);

    const fetchDepos = async () => {
        try {
            const response = await getAllDepos();
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    const sortedCategories = data.sort((a, b) => {
                        if (a.depoName && b.depoName) {
                            return a.depoName.localeCompare(b.depoName);
                        } else if (a.depoName) {
                            return -1;
                        } else if (b.depoName) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                    setDepos(sortedCategories);
                } else {
                    console.error('Expected an array but got:', data);
                    setDepos([]); // Set categories to empty array if response is not an array
                }
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <Container className="container-2">
            <div className="form form-2">
                <h2 className="text-center mb-4">Institute Registration</h2>
                {showSuccessAlert && (
                    <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                        Sign-up successful!
                    </Alert>
                )}

                {signupErrors.server && (
                    <div className="alert alert-danger">
                        {signupErrors.server}
                    </div>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="collegeName" className="pb-4">
                                <Form.Control
                                    className="large-input"
                                    type="text"
                                    name="collegeName"
                                    value={signupData.collegeName}
                                    onChange={handleChange}
                                    minLength="3"
                                    isInvalid={!!signupErrors.collegeName}
                                    placeholder="Institute Name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.collegeName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="collegeCode" className='pb-4'>
                                <Form.Control
                                    className="large-input"
                                    type="text"
                                    name="collegeCode"
                                    value={signupData.collegeCode}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.collegeCode}
                                    placeholder="Institute Code"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.collegeCode}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="collegeEmail" className="pb-4">
                                <Form.Control
                                    className="large-input"
                                    type="email"
                                    name="collegeEmail"
                                    value={signupData.collegeEmail}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.collegeEmail}
                                    placeholder="Email"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.collegeEmail}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="collegeDepo" className="pb-4">
                                <Form.Control
                                    className="large-input text-center right-align-options"
                                    as="select"
                                    name="collegeDepo"
                                    value={signupData.collegeDepo}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.collegeDepo}
                                >
                                    <option value="">Select Depo</option>
                                    {depos.map((depo) => (
                                        <option key={depo._id} value={depo._id}>
                                            {depo.depoName}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.collegeDepo}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group controlId="collegeAddress" className="pb-4">
                        <Form.Control
                            className="large-input"
                            type="text"
                            name="collegeAddress"
                            value={signupData.collegeAddress}
                            onChange={handleChange}
                            isInvalid={!!signupErrors.collegeAddress}
                            placeholder="Address"
                        />
                        <Form.Control.Feedback type="invalid">
                            {signupErrors.collegeAddress}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="mt-2 signup-button">
                        Sign Up
                    </Button>
                </Form>
            </div>
        </Container>
    );
}

export default EditRetailerDetails
