import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Container, Row, Alert } from 'react-bootstrap';
import { addRetailer } from '../../utils/api';


const AddRetailer = () => {
  const [institutes, setInstitutes] = useState([]);

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    location: '',
    ward: '',
    password: ''
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

      const response = await addRetailer(signupData);
      if (response.ok) {
        setShowSuccessAlert(true);
        setSignupData({
          firstName: '',
          lastName: '',
          email: '',
          mobile: '',
          location: '',
          ward: '',
          password: ''
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



  return (
    <Container className="container-2">
      <div className="form form-2">
        <h2 className="text-center mb-4">Add Retailer</h2>
        {showSuccessAlert && (
          <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
            Retailer Added Successfully
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
            <Col xs={6}>
              <Form.Group controlId="location" className="pb-4">
                <Form.Control
                  type='text'
                  name="location"
                  value={signupData.location}
                  onChange={handleChange}
                  isInvalid={!!signupErrors.location}
                  placeholder='Location'
                >
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {signupErrors.location}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={6}>
              <Form.Group controlId="ward" className="pb-4">
                <Form.Control
                  className="large-input"
                  type="text"
                  name="ward"
                  value={signupData.ward}
                  onChange={handleChange}
                  isInvalid={!!signupErrors.ward}
                  placeholder="Ward"
                />
                <Form.Control.Feedback type="invalid">
                  {signupErrors.ward}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Form.Group controlId="password" className="pb-4">
                <Form.Control
                  className="large-input"
                  type="text"
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
          </Row>

          <Button variant="primary" type="submit" className="mt-2 signup-button">
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default AddRetailer
