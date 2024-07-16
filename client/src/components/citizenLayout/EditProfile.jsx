import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Container, Row, Alert } from 'react-bootstrap';
import { getAllInstitutes, updateStudent } from '../../utils/api';
import { useStudentData } from '../../utils/Cookies';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {

    const navigate = useNavigate();

    const [institutes, setInstitutes] = useState([]);

    const { student: initialData, setInitialData } = useStudentData();

    const [signupData, setSignupData] = useState(initialData);

    console.log(signupData)

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
            // Clone signupData without the password field
            const { password, ...profileData } = signupData;

            const response = await updateStudent(initialData._id, profileData);
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
        fetchInstitutes();
    }, []);

    const fetchInstitutes = async () => {
        try {
            const response = await getAllInstitutes();
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    const sortedCategories = data.sort((a, b) => {
                        if (a.depoName && b.depoName) {
                            return a.depoName.localeCompare(b.depoName);
                        }
                    });
                    setInstitutes(sortedCategories);
                } else {
                    console.error('Expected an array but got:', data);
                    setInstitutes([]); // Set categories to empty array if response is not an array
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
                <h2 className="text-center mb-4">Edit Profile</h2>
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

                    <Form.Group controlId="college" className="pb-4">
                        <Form.Control
                            className="large-input text-center right-align-options"
                            as="select"
                            name="institute"
                            value={signupData.institute}
                            onChange={handleChange}
                            isInvalid={!!signupErrors.institute}
                        >
                            <option value="">Select College</option>
                            {institutes.map((institute) => (
                                <option key={institute._id} value={institute._id}>
                                    {institute.collegeName}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {signupErrors.collegeName}
                        </Form.Control.Feedback>
                    </Form.Group>

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
                    <Button variant="primary" type="submit" className="mt-2 signup-button">
                        Sign Up
                    </Button>
                </Form>
            </div>
        </Container>
    );
}

export default EditProfile
