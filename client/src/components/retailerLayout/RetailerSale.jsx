import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { getCitizensByRationCardNumberAndRetailer, getItemByReatiler, issueRation } from '../../utils/api';
import { useRetailerData } from '../../utils/Cookies';
import { format } from 'date-fns'; // Import the format function from date-fns

const RetailerSale = () => {

  const { retailer: initalData } = useRetailerData();
  const [items, setItems] = useState({});
  const [rationCardNumber, setRationCardNumber] = useState('');
  const [citizenData, setCitizenData] = useState(null);
  const [error, setError] = useState(null);
  const [signupErrors, setSignupErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd')); // State for the date input

  useEffect(() => {
    getItems();
  }, [initalData]);

  const getItems = async () => {
    try {
      const response = await getItemByReatiler(initalData._id);
      if (response.ok) {
        const data = await response.json();        // Ensure data is an array before setting it
        setItems(data);
      } else {
        console.error('Failed to fetch items');
        setItems([]); // Set to an empty array in case of failure
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]); // Set to an empty array in case of error
    }
  };

  const handleInputChange = (event) => {
    setRationCardNumber(event.target.value);
  };

  const handleSearchClick = async (event) => {
    event.preventDefault();
    try {
      const response = await getCitizensByRationCardNumberAndRetailer(rationCardNumber, initalData._id);
      if (response.ok) {
        const data = await response.json();
        setCitizenData(data);
        setError(null);
      } else {
        setCitizenData(null);
        const errorData = await response.json();
        alert(errorData.message);
      }

    } catch (error) {
      setCitizenData(null);
      alert(error);
      setError(error.response?.data?.message || 'Error fetching citizen data');
    }
  };

  const handleDateChange = (event) => {
    setIssueDate(event.target.value); // Update the issueDate state when the input value changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!citizenData._id && !initalData._id) {
      alert("Citizen data or retailer data is missing. Please check the input and try again.");
      return;
    }

    const data = {
      citizen: citizenData._id,
      retailer: initalData._id,
      wheat: items.wheat,
      rice: items.rice,
      sugar: items.sugar,
      date: issueDate, // Use the issueDate state here
      issued: true
    };

    setSignupErrors({});
    try {
      console.log(data)
      const response = await issueRation(data);
      if (response.ok) {
        setShowSuccessAlert(true);
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
    <div>
      <Form onSubmit={handleSearchClick}>
        <Container>
          <h1>Retailer Sale</h1>
          <Row>
            <Col xs={4}></Col>
            <Col xs={4} className='pt-4'>
              <Form.Control
                type="text"
                placeholder="Enter Ration Card Number"
                value={rationCardNumber}
                onChange={handleInputChange}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </Col>
            <Col xs={2} className='pt-4'>
              <Button onClick={handleSearchClick}>Search</Button>
            </Col>
          </Row>
        </Container>

        {citizenData && (
          <Container className='container-1'>
            <div className='form-1'>
              <Row>
                <h3>Citizen Details:</h3>

                {showSuccessAlert && (
                  <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                    Sale issued successfully!
                  </Alert>
                )}

                {signupErrors.server && (
                  <div className="alert alert-danger">
                    {signupErrors.server}
                  </div>
                )}
              </Row>
              <Row className='pt-4'>
                <Row>
                  <Col xs={6}><b>Name</b></Col>
                  <Col xs={6}>{citizenData.firstName} {citizenData.lastName}</Col>
                </Row>
                <Row className='pt-2'>
                  <Col xs={6}><b>Ration Card No</b></Col>
                  <Col xs={6}>{citizenData.rationCardNo}</Col>
                </Row>
                <Row className='pt-2'>
                  <Col xs={6}><b>Email</b></Col>
                  <Col xs={6}>{citizenData.email}</Col>
                </Row>
                <Row className='pt-2'>
                  <Col xs={6}><b>Address</b></Col>
                  <Col xs={6}>{citizenData.address}</Col>
                </Row>
                <Row className='pt-2'>
                  <Col xs={6}><b>Date Of Birth</b></Col>
                  <Col xs={6}>{citizenData.dateOfBirth}</Col>
                </Row>
                <Row className='pt-2'>
                  <Col xs={6}><b>Gender</b></Col>
                  <Col xs={6}>{citizenData.gender}</Col>
                </Row>
                <Row className='pt-2'>
                  <Col xs={6}><b>Mobile</b></Col>
                  <Col xs={6}>{citizenData.mobile}</Col>
                </Row>

                <Row>
                  <Row className='pt-2'>
                    <Col><b>Rice:</b></Col>
                    <Col>{items.rice}</Col>
                  </Row>
                  <Row className='pt-2'>
                    <Col><b>Wheat:</b></Col>
                    <Col>{items.wheat}</Col>
                  </Row>
                  <Row className='pt-2'>
                    <Col><b>Sugar:</b></Col>
                    <Col> {items.sugar}</Col>
                  </Row>
                </Row>

              </Row>

              <Row className='pt-2'>

                <Col sm={12}>
                  <Form.Group controlId="issueDate" className="pb-4">
                    <Row>
                      <Col xs={6} className="align-items-end">
                        <b>Issue Date:</b>
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          type="date"
                          name="issueDate"
                          value={issueDate} // Controlled input value
                          onChange={handleDateChange} // Handle change to update state
                          className="large-input"
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>

              <Row className='pt-4'>
                <Col>
                  <Button variant='success' className="signup-button-2" onClick={handleSubmit}>Issue</Button>
                </Col>
              </Row>
            </div>
          </Container>
        )}
      </Form>
    </div>
  );
};

export default RetailerSale;
