import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Container, Row, Alert } from 'react-bootstrap';
import { citizenRegister, getAllInstitutes, getRetailers } from '../../utils/api';

const Register = () => {

    const [retailers, setRetailers] = useState([]); // State to store list of retailers

    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        password: '',
        mobile: '',
        rationCardNo: '',
        retailer : ''
    });

    const [signupErrors, setSignupErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
    };

    const validateSignup = () => {
        const errors = {};
        if (!signupData.firstName) errors.firstName = 'First name is required';
        if (!signupData.email) errors.email = 'Email is required';
        if (!signupData.password) errors.password = 'Password is required';
        if (!signupData.confirmPassword) errors.confirmPassword = 'Enter Confirm Password';

        if (signupData.password !== signupData.confirmPassword) {
            errors.confirmPassword = 'Entered password and confirm password do not match';
        }

        if (!signupData.rationCardNo) errors.rationCardNo = 'Ration Card No is required';
        return errors;
    };

    const handleSubmit = async (e) => {

        console.log(signupData)
        e.preventDefault();
        const errors = validateSignup();

        if (Object.keys(errors).length > 0) {
            setSignupErrors(errors);
            return;
        }

        setSignupErrors({});
        try {

            const response = await citizenRegister(signupData);
            if (response.ok) {
                setShowSuccessAlert(true);
                setSignupData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    address: '',
                    dateOfBirth: '',
                    gender: '',
                    password: '',
                    mobile: '',
                    rationCardNo: '',
                    retailer : ''
                });
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
        getRetailersList(); // Fetch the list of retailers when the component mounts
    }, []);

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


    return (
        <Container className="container-2">
            <div className="form form-2">
                <h2 className="text-center mb-4">Citizen Registration</h2>
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
                            <Form.Group controlId="firstName" className="pb-4">
                                <Form.Control
                                    className="large-input"
                                    type="text"
                                    name="firstName"
                                    value={signupData.firstName}
                                    onChange={handleChange}
                                    minLength="3"
                                    isInvalid={!!signupErrors.firstName}
                                    placeholder="First Name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.firstName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="lastName" className='pb-4'>
                                <Form.Control
                                    className="large-input"
                                    type="text"
                                    name="lastName"
                                    value={signupData.lastName}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.lastName}
                                    placeholder="Last Name"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="email" className="pb-4">
                                <Form.Control
                                    className="large-input"
                                    type="email"
                                    name="email"
                                    value={signupData.email}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.email}
                                    placeholder="Email"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group controlId="mobile" className="pb-4">
                                <Form.Control
                                    className="large-input"
                                    type="number"
                                    name="mobile"
                                    value={signupData.mobile}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.mobile}
                                    placeholder="Mobile No."
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.mobile}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Form.Group controlId="retailer" className="pb-4">
                                <Form.Control
                                    className="large-input text-center right-align-options"
                                    as="select"
                                    name="retailer"
                                    value={signupData.retailer}
                                    onChange={handleChange}
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
                        </Col>
                        <Col xs={6}>
                            <Form.Group controlId="rationCardNo" className="pb-4">
                                <Form.Control
                                    type='text'
                                    name="rationCardNo"
                                    value={signupData.rationCardNo}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.rationCardNo}
                                    placeholder='Ration Card No'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.rationCardNo}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group controlId="address" className="pb-4">
                        <Form.Control
                            className="large-input"
                            type="text"
                            name="address"
                            value={signupData.address}
                            onChange={handleChange}
                            isInvalid={!!signupErrors.address}
                            placeholder="Address"
                        />
                        <Form.Control.Feedback type="invalid">
                            {signupErrors.address}
                        </Form.Control.Feedback>
                    </Form.Group>


                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="dateOfBirth" className="pb-4">
                                <Row>
                                    <Col xs={4} className="d-flex align-items-center">
                                        <Form.Label>Birth Date</Form.Label>
                                    </Col>
                                    <Col xs={8}>
                                        <Form.Control
                                            type="date"
                                            name="dateOfBirth"
                                            value={signupData.dateOfBirth}
                                            onChange={handleChange}
                                            isInvalid={!!signupErrors.dateOfBirth}
                                            className="large-input"
                                            placeholder='Date of Birth'
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {signupErrors.dateOfBirth}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="gender" className="pb-4">
                                <Form.Control
                                    className="large-input"
                                    as="select"
                                    name="gender"
                                    value={signupData.gender}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.gender}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.gender}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="password" className="pb-4">
                                <Form.Control
                                    className="large-input"
                                    type="password"
                                    name="password"
                                    value={signupData.password}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.password}
                                    placeholder="Password"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Form.Group controlId="confirmPassword" className="pb-4">
                                <Form.Control
                                    className="large-input"
                                    type="password"
                                    name="confirmPassword"
                                    value={signupData.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={!!signupErrors.confirmPassword}
                                    placeholder="Confirm Password"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {signupErrors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="mt-2 signup-button">
                        Sign Up
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default Register;
