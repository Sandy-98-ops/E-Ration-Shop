import React, { useEffect, useState } from 'react'
import { deleteItemById, getAllStocks, getRetailers, updateItemDetails } from '../../utils/api';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Alert } from 'bootstrap/dist/js/bootstrap.bundle.min';
import { format } from 'date-fns';

const ViewIssuedStocks = () => {

    const [stocks, setStocks] = useState([]);
    const [items, setItems] = useState([])
    const [retailers, setRetailers] = useState([]); // State to store list of retailers
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setselectedItem] = useState(null);
    const [signupErrors, setSignupErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);


    useEffect(() => {
        getStocksList();
        getRetailersList(); // Fetch the list of retailers when the component mounts

    }, []);

    const getStocksList = async () => {
        try {
            const response = await getAllStocks();
            if (response.ok) {
                const data = await response.json();

                console.log(data)
                setStocks(data);
            } else {
                console.error('Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    }


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


    const handleEdit = (stock) => {
        setselectedItem(stock);
        setShowModal(true);
    };

    const handleDelete = async (stockId) => {
        try {
            const response = await deleteItemById(stockId);
            if (response.ok) {
                alert("Item Deleted Successfully");
                getAllStocks();
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
                    prevItems.map(stock =>
                        stock._id === selectedItem._id ? selectedItem : stock
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

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [ward, setWard] = useState('');
    const [filteredSales, setFilteredSales] = useState(stocks);

    const formatDate = (date) => {
        const formatDate = new Date(date);

        return format(formatDate, 'MMM yyyy');
    }

    useEffect(() => {
        setFilteredSales(stocks);
    }, [stocks]);

    const handleSearch = () => {
        const filtered = stocks.filter(stocks => {
            const saleDate = new Date(stocks.issueDate);
            const saleYear = saleDate.getFullYear();
            const saleMonth = saleDate.getMonth() + 1; // Months are 0-based


            return (
                (!year || saleYear === parseInt(year)) &&
                (!month || saleMonth === parseInt(month))
            );
        });
        setFilteredSales(filtered);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    return (
        <div>
            <Container className="container-1">
                <div className="list-container scrollable-list">
                    <Row >
                        <Col xs={12} sm={2}>
                            <h2 className="mb-4">Stock List</h2>
                        </Col>

                        <Col sm={3}>
                            <Form.Control as="select" value={year} onChange={handleYearChange}>
                                <option value="">Select Year</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                            </Form.Control>
                        </Col>
                        <Col sm={3}>
                            <Form.Control as="select" value={month} onChange={handleMonthChange}>
                                <option value="">Select Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </Form.Control>
                        </Col>
                        <Col sm={2}>
                            <Button onClick={handleSearch}>Search</Button>
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
                        <Col xs={12} sm={2} className="text-center">Ward</Col>
                        <Col xs={12} sm={2} className="text-center">Date</Col>
                        <Col xs={12} sm={3} className="text-center">Issued Stock</Col>
                        <Col xs={12} sm={3} className="text-center">Remaining Stock</Col>
                        {/* <Col xs={12} sm={2} className="text-center">Actions</Col> */}
                    </Row>

                    {filteredSales.map((stock, index) => (
                        <Row key={index} className="table-row border">
                            <Col xs={12} sm={1} className="text-center pt-4">{index + 1}</Col>
                            <Col xs={12} sm={2} className="text-center pt-4">{getRetailerWardById(stock.retailer)}</Col>
                            <Col xs={12} sm={2} className="text-center pt-4">{formatDate(stock.issueDate)}</Col>

                            <Col sm={3} className="text-center border">
                                <Row className="text-center border">
                                    <Col className="text-center border">
                                        Rice
                                    </Col>
                                    <Col xs={12} sm={3} className="text-center">{stock.totalRice}</Col>
                                </Row>

                                <Row className="text-center border">
                                    <Col className="text-center border">
                                        Wheat
                                    </Col>
                                    <Col xs={12} sm={3} className="text-center">{stock.totalWheat}</Col>
                                </Row>

                                <Row className="text-center border">
                                    <Col className="text-center border">
                                        Sugar
                                    </Col>
                                    <Col xs={12} sm={3} className="text-center">{stock.totalSugar}</Col>
                                </Row>
                            </Col>

                            <Col sm={3} className="text-center border">
                                <Row className="text-center border">
                                    <Col className="text-center border">
                                        Rice
                                    </Col>
                                    <Col xs={12} sm={3} className="text-center">{stock.remainingRice}</Col>
                                </Row>

                                <Row className="text-center border">
                                    <Col className="text-center border">
                                        Wheat
                                    </Col>
                                    <Col xs={12} sm={3} className="text-center">{stock.remainingWheat}</Col>
                                </Row>

                                <Row className="text-center border">
                                    <Col className="text-center border">
                                        Sugar
                                    </Col>
                                    <Col xs={12} sm={3} className="text-center">{stock.remainingSugar}</Col>
                                </Row>
                            </Col>


                            {/* <Col xs={12} sm={2} className="text-center pt-4">
                                <Button variant="warning" onClick={() => handleEdit(stock)}>Edit</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(stock._id)}>Delete</Button>
                            </Col> */}
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

export default ViewIssuedStocks
