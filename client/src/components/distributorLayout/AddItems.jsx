import React, { useEffect, useState } from 'react'
import { addItem, citizenRegister, getRetailers } from '../../utils/api';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';

const AddItems = () => {

  const [data, setData] = useState({
    retailer: '',
    wheat: '',
    rice: '',
    sugar: ''
  })


  const [retailers, setRetailers] = useState([]);
  const [signupErrors, setSignupErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    getRetailersList();
  }, []);

  const getRetailersList = async () => {
    try {
      const response = await getRetailers();
      if (response.ok) {
        const data = await response.json();
        setRetailers(data);

      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };


  const validateSignup = () => {
    const errors = {};
    if (!data.retailer) errors.retailer = 'Ward is required';

    return errors;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateSignup();

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    setSignupErrors({});
    try {

      const response = await addItem(data);
      if (response.ok) {
        setShowSuccessAlert(true);
        setData({
          retailer: '',
          wheat: '',
          rice: '',
          sugar: ''
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
  }
  return (
    <div>
      <Container className="container-2">
        <div className="form form-2">
          <h2 className="text-center mb-4">Add Item Details</h2>
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
              <Col sm={12}>
                <Form.Group controlId="college" className="pb-4">
                  <Form.Control
                    className="large-input text-center right-align-options"
                    as="select"
                    name="retailer"
                    value={data.retailer}
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

              {/* <Col sm={8}>
                <Form.Group controlId="dateOfBirth" className="pb-4">
                  <Row>
                    <Col xs={4} className="align-items-end">
                      <Form.Label>Issue Date:</Form.Label>
                    </Col>
                    <Col xs={8}>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={data.dateOfBirth}
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
              </Col> */}
            </Row>

            <Row>
              <Col sm={12}>
                <Form.Group controlId="wheat" className="pb-4">
                  <Form.Control
                    className="large-input"
                    type="number"
                    name="wheat"
                    value={data.wheat}
                    onChange={handleChange}
                    minLength="3"
                    isInvalid={!!signupErrors.wheat}
                    placeholder="Wheat In Kg"
                  />
                  <Form.Control.Feedback type="invalid">
                    {signupErrors.wheat}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group controlId="rice" className="pb-4">
                  <Form.Control
                    className="large-input"
                    type="number"
                    name="rice"
                    value={data.rice}
                    onChange={handleChange}
                    minLength="3"
                    isInvalid={!!signupErrors.rice}
                    placeholder="Rice In Kg"
                  />
                  <Form.Control.Feedback type="invalid">
                    {signupErrors.rice}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <Form.Group controlId="sugar" className="pb-4">
                  <Form.Control
                    className="large-input"
                    type="number"
                    name="sugar"
                    value={data.sugar}
                    onChange={handleChange}
                    minLength="3"
                    isInvalid={!!signupErrors.sugar}
                    placeholder="Sugar In Kg"
                  />
                  <Form.Control.Feedback type="invalid">
                    {signupErrors.sugar}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-2 signup-button">
              Add
            </Button>


          </Form>
        </div>
      </Container>
    </div>


  )
}

export default AddItems
