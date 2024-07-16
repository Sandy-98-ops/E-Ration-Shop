import React, { forwardRef, useEffect, useState } from 'react';
import { Image, Col, Row } from 'react-bootstrap';
import ksrtcLogo from '../../utils/KSRTC.jpg'; // Adjust the path based on your project structure
import { getInstituteById } from '../../utils/api';

const PrintableCard = forwardRef(({ application }, ref) => {
    const [institute, setInstitute] = useState({});

    useEffect(() => {
        const fetchInstitute = async () => {
            if (application) {
                try {
                    const response = await getInstituteById(application.institute);
                    if (response.ok) {
                        const data = await response.json();
                        setInstitute(data);
                    } else {
                        const errorData = await response.json();
                        console.error('Error fetching institute:', errorData);
                    }
                } catch (error) {
                    console.error('Error fetching institute:', error);
                }
            }
        };

        fetchInstitute();
    }, [application]);

    if (!application) return null;

    return (
        <div ref={ref} className='pt-4' style={{ padding: '50px', width: '500px', border: '1px solid black', margin: '0 auto' }}>
            <Row>
                <Col xs={3}>
                    <Image src={ksrtcLogo} alt="KSRTC Logo" style={{ width: '100%' }} />
                </Col>
                <Col xs={6} className="text-center">
                    <h5>KSRTC</h5>
                </Col>
                <Col xs={3}>
                    {application.photo && (
                        <Image src={`http://localhost:7000/${application.photo}`} style={{ width: '100px', height: '100px' }} />
                    )}
                </Col>
            </Row>
            <Row className="text-center mt-3">
                <Col xs={2}>
                    <h6>Name:</h6>
                </Col>
                <Col xs={5}>
                    <h6>{application.firstName} {application.lastName}</h6>
                </Col>
                <Col xs={1}>
                    <h6>Course:</h6>
                </Col>
                <Col xs={4}>
                    <h6>{application.course}</h6>
                </Col>
            </Row>
            <Row className="text-center mt-3">
                <Col>
                    <b>College Name :</b> {institute.collegeName}
                </Col>
            </Row>
            <Row className="text-center mt-3">
                <Col xs={6}>
                    <b> From Date: </b>{application.fromDate}
                </Col>
                <Col xs={6}>
                    <b>To Date:</b> {application.toDate}
                </Col>
            </Row>
            <Row className="text-center mt-3">
                <Col xs={6}>
                    <b>From:</b> {application.from}
                </Col>
                <Col xs={6}>
                    <b>To:</b> {application.to}
                </Col>
            </Row>
        </div>
    );
});

export default PrintableCard;
