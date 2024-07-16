import React, { useEffect, useState } from 'react'
import { deleteItemById, getAllStockByRetailer, getAllStocks, getAllStocksByRetailerId, getRetailers, updateItemDetails } from '../../utils/api';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Alert } from 'bootstrap/dist/js/bootstrap.bundle.min';
import { format } from 'date-fns';
import { useRetailerData } from '../../utils/Cookies';

const ViewRetailerStock = () => {

    const { retailer: initalData } = useRetailerData();

    const [stocks, setStocks] = useState([]);
    const [items, setItems] = useState([])
    const [retailers, setRetailers] = useState([]); // State to store list of retailers
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setselectedItem] = useState(null);
    const [signupErrors, setSignupErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [totalIssuedRice, setTotalIssuedRice] = useState(0);
    const [totalIssuedWheat, setTotalIssuedWheat] = useState(0);
    const [totalIssuedSugar, setTotalIssuedSugar] = useState(0);

    const [totalRemainingRice, setTotalRemainingRice] = useState(0);
    const [totalRemainingWheat, setTotalRemainingWheat] = useState(0);
    const [totalRemainingSugar, setTotalRemainingSugar] = useState(0);

    useEffect(() => {
        getStocksList();
    }, []);

    useEffect(() => {
        calculateTotals(stocks);
    }, [stocks]);

    const getStocksList = async () => {
        try {
            const response = await getAllStocksByRetailerId(initalData._id);
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

    const calculateTotals = (stocks) => {
        let issuedRice = 0, issuedWheat = 0, issuedSugar = 0;
        let remainingRice = 0, remainingWheat = 0, remainingSugar = 0;

        stocks.forEach(stock => {
            issuedRice += stock.totalRice;
            issuedWheat += stock.totalWheat;
            issuedSugar += stock.totalSugar;
            remainingRice += stock.remainingRice;
            remainingWheat += stock.remainingWheat;
            remainingSugar += stock.remainingSugar;
        });

        setTotalIssuedRice(issuedRice);
        setTotalIssuedWheat(issuedWheat);
        setTotalIssuedSugar(issuedSugar);
        setTotalRemainingRice(remainingRice);
        setTotalRemainingWheat(remainingWheat);
        setTotalRemainingSugar(remainingSugar);
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
                getStocksList();
            } else {
                setShowErrorAlert(true);
                setSignupErrors({ server: 'An error occurred. Please try again.' });
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
                getStocksList(); // Update the stocks list after modification
            } else {
                setShowErrorAlert(true);
                setSignupErrors({ server: 'An error occurred. Please try again.' });
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

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [filteredStocks, setFilteredStocks] = useState(stocks);

    const formatDate = (date) => {
        const formatDate = new Date(date);

        return format(formatDate, 'MMM yyyy');
    }

    useEffect(() => {
        setFilteredStocks(stocks);
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
        setFilteredStocks(filtered);
        calculateTotals(filtered); // Recalculate totals for filtered stocks
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
                        <Col xs={12} sm={3} className="text-center">Date</Col>
                        <Col xs={12} sm={4} className="text-center">Issued Stock</Col>
                        <Col xs={12} sm={4} className="text-center">Remaining Stock</Col>
                    </Row>

                    {filteredStocks.map((stock, index) => (
                        <Row key={index} className="table-row border">
                            <Col xs={12} sm={1} className="text-center pt-4">{index + 1}</Col>
                            <Col xs={12} sm={2} className="text-center pt-4">{formatDate(stock.issueDate)}</Col>

                            <Col sm={4} className="text-center border">
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

                            <Col sm={4} className="text-center border">
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
                        </Row>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default ViewRetailerStock;
