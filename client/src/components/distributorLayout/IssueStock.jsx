import React, { useEffect, useState } from 'react';
import { createStock, getAllStockByRetailer, getAllStocks, getCitizensByRetailer, getItemsList, getRetailers } from '../../utils/api';
import { Alert, Col, Container, Form, Row } from 'react-bootstrap';

const IssueStock = () => {
    const [items, setItems] = useState([]);
    const [retailers, setRetailers] = useState([]); // State to store list of retailers
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [signupErrors, setSignupErrors] = useState({});
    const [stock, setStock] = useState({
        retailer: '',
        issueDate: '',
        wheat: 0,
        rice: 0,
        sugar: 0,
        citizenCount: 0,
        totalWheat: 0,
        totalRice: 0,
        totalSugar: 0,
        remainingWheat: 0,
        remainingRice: 0,
        remainingSugar: 0
    });

    const [citizens, setCitizens] = useState([]);

    useEffect(() => {
        getItems();
        getRetailersList(); // Fetch the list of retailers when the component mounts
        getCitizenList();
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

    const getCitizenList = async () => {
        try {
            const response = await getCitizensByRetailer();
            if (response.ok) {
                const data = await response.json();
                setCitizens(data);
            } else {
                console.error('Failed to fetch retailers');
            }
        } catch (error) {
            console.error('Error fetching retailers:', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setStock(prevStock => ({
            ...prevStock,
            [name]: value
        }));

        if (name === 'retailer') {
            const selectedRetailerItem = items.find(item => item.retailer === value);
            if (selectedRetailerItem) {
                setStock(prevStock => ({
                    ...prevStock,
                    wheat: selectedRetailerItem.wheat,
                    rice: selectedRetailerItem.rice,
                    sugar: selectedRetailerItem.sugar,
                    // Temporarily setting total values to avoid undefined values
                    totalSugar: selectedRetailerItem.sugar * (prevStock.citizenCount || 0),
                    totalRice: selectedRetailerItem.rice * (prevStock.citizenCount || 0),
                    totalWheat: selectedRetailerItem.wheat * (prevStock.citizenCount || 0)
                }));
            } else {
                setStock(prevStock => ({
                    ...prevStock,
                    wheat: '',
                    rice: '',
                    sugar: '',
                    totalSugar: 0,
                    totalRice: 0,
                    totalWheat: 0
                }));
            }

            if (value !== undefined && value !== 'undefined' && value !== '') {
                try {
                    const response = await getCitizensByRetailer(value);
                    const response2 = await getAllStockByRetailer(value);

                    if (response.ok) {
                        const data = await response.json();
                        setStock(prevStock => ({
                            ...prevStock,
                            citizenCount: data.length,
                            // Ensure the calculation uses the latest values
                        }));
                    } else {
                        console.error('Failed to fetch citizens');
                    }

                    if (response2.ok) {
                        const data2 = await response2.json();

                        console.log(data2)
                        setStock(prevStock => ({
                            ...prevStock,
                            // Ensure the calculation uses the latest values
                            remainingRice: data2.remainingRice,
                            remainingWheat: data2.remainingWheat,
                            remainingSugar: data2.remainingSugar,

                            totalRice: (prevStock.rice * prevStock.citizenCount) - data2.remainingRice,
                            totalWheat: (prevStock.wheat * prevStock.citizenCount) - data2.remainingWheat,
                            totalSugar: (prevStock.sugar * prevStock.citizenCount) - data2.remainingSugar

                        }));
                    } else {
                        setStock(prevStock => ({
                            ...prevStock,
                            // Ensure the calculation uses the latest values
                            totalRice: (prevStock.rice * prevStock.citizenCount),
                            totalWheat: (prevStock.wheat * prevStock.citizenCount),
                            totalSugar: (prevStock.sugar * prevStock.citizenCount)

                        }));
                        console.error('Failed to fetch citizens');
                    }
                } catch (error) {
                    console.error('Error fetching citizens:', error);
                }
            } else {
                setStock(prevStock => ({
                    ...prevStock,
                    citizenCount: 0,
                    totalSugar: 0,
                    totalRice: 0,
                    totalWheat: 0
                }));
            }
        }
    };



    const validateSignup = () => {
        const errors = {};
        if (!stock.retailer) errors.retailer = 'Ward is required';
        if (!stock.issueDate) errors.issueDate = 'Issue Date is required';
        if (stock.citizenCount == 0) errors.citizenCount = 'There are no Citizens to issue stock';
        if (stock.totalRice == 0 && stock.totalWheat == 0 && stock.totalSugar == 0) errors.stockIssueError = 'No stock to issue';
        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(stock.issueDate);
        const errors = validateSignup();

        if (Object.keys(errors).length > 0) {
            setSignupErrors(errors);
            return;
        }

        setSignupErrors({});
        try {
            const response = await createStock(stock);
            if (response.ok) {
                setShowSuccessAlert(true);
                setStock({
                    retailer: '',
                    issueDate: '',
                    wheat: 0,
                    rice: 0,
                    sugar: 0,
                    citizenCount: 0,
                    totalWheat: 0,
                    totalRice: 0,
                    totalSugar: 0
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
        <div>
            <Container className="container-2">
                <div className="form form-3">
                    <h2 className="text-center mb-4">Issue Stock</h2>
                    {showSuccessAlert && (
                        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                            Stock issued successfully!
                        </Alert>
                    )}

                    {signupErrors.server && (
                        <div className="alert alert-danger">
                            {signupErrors.server}
                        </div>
                    )}

                    {signupErrors.stockIssueError && (
                        <div className="alert alert-danger">
                            {signupErrors.stockIssueError}
                        </div>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col sm={3}>
                                <Form.Group controlId="retailer" className="pb-4">
                                    <Form.Control
                                        className="large-input text-center right-align-options"
                                        as="select"
                                        name="retailer"
                                        value={stock.retailer}
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

                            <Col sm={6}>
                                <Form.Group controlId="issueDate" className="pb-4">
                                    <Row>
                                        <Col xs={4} className="align-items-end">
                                            <Form.Label>Issue Date:</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control
                                                type="date"
                                                name="issueDate"
                                                value={stock.issueDate}
                                                onChange={handleChange}
                                                isInvalid={!!signupErrors.issueDate}
                                                className="large-input"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {signupErrors.issueDate}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={1} className='pt-4'>
                                Wheat
                            </Col>
                            <Col sm={1}>
                                <Form.Group controlId="wheat" className="pt-2">
                                    <Form.Label></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="wheat"
                                        value={stock.wheat}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group controlId="wheat" className="pb-4">
                                    <Form.Label>Citizen Count</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="citizenCount"
                                        value={stock.citizenCount}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group controlId="wheat" className="pb-4">
                                    <Form.Label>Remaining Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="remainingWheat"
                                        value={stock.remainingWheat}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group controlId="wheat" className="pb-4">
                                    <Form.Label>Total</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="totalWheat"
                                        value={stock.totalWheat}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={1}>
                                Rice
                            </Col>
                            <Col sm={1}>
                                <Form.Group controlId="rice" className="pb-4">
                                    <Form.Control
                                        type="number"
                                        name="rice"
                                        value={stock.rice}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group controlId="wheat" className="pb-4">
                                    <Form.Control
                                        type="number"
                                        name="citizenCount"
                                        value={stock.citizenCount}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group controlId="wheat" className="pb-4">
                                    <Form.Control
                                        type="number"
                                        name="remainingRice"
                                        value={stock.remainingRice}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group controlId="totalRice" className="pb-4">
                                    <Form.Control
                                        type="number"
                                        name="totalRice"
                                        value={stock.totalRice}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={1}>
                                Sugar
                            </Col>
                            <Col sm={1}>
                                <Form.Group controlId="sugar" className="pb-4">
                                    <Form.Control
                                        type="number"
                                        name="sugar"
                                        value={stock.sugar}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                                <Form.Group controlId="wheat" className="pb-4">
                                    <Form.Control
                                        type="number"
                                        name="citizenCount"
                                        value={stock.citizenCount}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group controlId="wheat" className="pb-4">
                                    <Form.Control
                                        type="number"
                                        name="remainingSugar"
                                        value={stock.remainingSugar}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group controlId="totalSugar" className="pb-4">
                                    <Form.Control
                                        type="number"
                                        name="totalSugar"
                                        value={stock.totalSugar}
                                        onChange={handleChange}
                                        className="large-input"
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                        <div className="d-flex justify-content-center mt-4">
                            <button className="btn btn-primary" type="submit">
                                Issue Stock
                            </button>
                        </div>
                    </Form>
                </div>
            </Container>
        </div>
    );
}

export default IssueStock;
