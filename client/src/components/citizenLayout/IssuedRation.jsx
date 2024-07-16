import React, { useEffect, useState } from 'react'
import { useCitizenData } from '../../utils/Cookies'
import { getSalesByCitizen } from '../../utils/api';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { format } from 'date-fns';

const IssuedRation = () => {

    const { citizen: initialData } = useCitizenData();

    // console.log("Citizen Data from cookie: ", initialData)

    const [sales, setSale] = useState([]);
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [ward, setWard] = useState('');
    const [filteredSales, setFilteredSales] = useState(sales);

    useEffect(() => {
        getSaleByCitizen();
    }, [initialData]);

    const getSaleByCitizen = async () => {
        try {

            console.log("Passing Citizen Id", initialData._id);
            const response = await getSalesByCitizen(initialData._id);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setSale(data);
            } else {
                console.error('Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const formatDate = (date) => {
        const formatDate = new Date(date);

        return format(formatDate, 'MMM yyyy');
    }

    useEffect(() => {
        setFilteredSales(sales);
    }, [sales]);

    const handleSearch = () => {
        const filtered = sales.filter(sales => {
            const saleDate = new Date(sales.date);
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
                    <Row>
                    <Col xs={12} sm={2}>
                            <h2 className="mb-4">Sale List</h2>
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

                    <Row className="table-header pb-2 pt-2 GuestHeader">
                        <Col xs={12} sm={2} className="text-center">Sl. No.</Col>
                        <Col xs={12} sm={4} className="text-center">Month</Col>
                        <Col xs={12} sm={2} className="text-center">Rice</Col>
                        <Col xs={12} sm={2} className="text-center">Wheat</Col>
                        <Col xs={12} sm={2} className="text-center">Sugar</Col>
                    </Row>

                    {filteredSales.map((sale, index) => (
                        <Row key={index} className="table-row">
                            <Col xs={12} sm={2} className="text-center">{index + 1}</Col>
                            <Col xs={12} sm={4} className="text-center">{formatDate(sale.date)}</Col>
                            <Col xs={12} sm={2} className="text-center">{sale.rice}</Col>
                            <Col xs={12} sm={2} className="text-center">{sale.wheat}</Col>
                            <Col xs={12} sm={2} className="text-center">{sale.sugar}</Col>
                        </Row>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default IssuedRation
