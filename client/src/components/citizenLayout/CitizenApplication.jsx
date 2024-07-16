// import React, { useState, useEffect } from 'react';
// import { Form, Button, Container, Alert, Row, Col, Modal } from 'react-bootstrap';
// import { studentPassApplication } from '../../utils/api';
// import { useStudentData } from '../../utils/Cookies';

// const CitizenApplication = () => {

//     // const { student: initialStudData } = useStudentData(); // Assuming this hook provides studentId

//     const [signupData, setSignupData] = useState({
//         studentId: initialStudData._id,
//         institute: initialStudData.institute,
//         firstName: '',
//         lastName: '',
//         address: '',
//         course: '',
//         from: '',
//         to: '',
//         fromDate: '',
//         toDate: '',
//         passAmount: '1200',
//         passStatus: 'Pending',
//         photo: null,
//         aadharCard: null,
//         collegeRecipt: null,
//     });

//     const [signupErrors, setSignupErrors] = useState({});
//     const [showSuccessAlert, setShowSuccessAlert] = useState(false);
//     const [showErrorAlert, setShowErrorAlert] = useState(false);

//     const [modalShow, setModalShow] = useState(false);
//     const [selectedDocument, setSelectedDocument] = useState(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSignupData({ ...signupData, [name]: value });
//     };

//     const handleFileChange = (e) => {
//         const { name, files } = e.target;
//         const file = files[0];
//         const maxSize = 2 * 1024 * 1024; // 2MB

//         if (file) {
//             const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
//             if (!validTypes.includes(file.type)) {
//                 setSignupErrors({ ...signupErrors, [name]: 'Invalid file type. Only JPG, JPEG, PNG and PDF are allowed.' });
//                 setSignupData({ ...signupData, [name]: null });
//                 return;
//             }

//             if (file.size > maxSize) {
//                 setSignupErrors({ ...signupErrors, [name]: 'File size exceeds the limit of 2MB.' });
//                 setSignupData({ ...signupData, [name]: null });
//                 return;
//             }

//             if (name === 'photo') {
//                 const img = new Image();
//                 img.onload = () => {
//                     if (img.width !== img.height) {
//                         setSignupErrors({ ...signupErrors, [name]: 'Invalid photo dimensions. Photo should be square (passport size).' });
//                         setSignupData({ ...signupData, [name]: null });
//                     } else {
//                         const { [name]: removedError, ...remainingErrors } = signupErrors;
//                         setSignupErrors(remainingErrors);
//                         setSignupData({ ...signupData, [name]: file });
//                     }
//                 };
//                 img.src = URL.createObjectURL(file);
//             } else {
//                 const { [name]: removedError, ...remainingErrors } = signupErrors;
//                 setSignupErrors(remainingErrors);
//                 setSignupData({ ...signupData, [name]: file });
//             }
//         }
//     };

//     const validateSignup = () => {
//         const errors = {};
//         if (!signupData.firstName) errors.firstName = 'First Name is required';
//         if (!signupData.lastName) errors.lastName = 'Last Name is required';
//         if (!signupData.address) errors.address = 'Address is required';
//         if (!signupData.course) errors.course = 'Course is required';
//         if (!signupData.from) errors.from = 'From location is required';
//         if (!signupData.to) errors.to = 'To location is required';
//         if (!signupData.fromDate) errors.fromDate = 'From Date is required';
//         if (!signupData.toDate) errors.toDate = 'To Date is required';
//         if (!signupData.photo) errors.photo = 'Photo is required';
//         if (!signupData.aadharCard) errors.aadharCard = 'Aadhar Card is required';
//         if (!signupData.collegeRecipt) errors.collegeRecipt = 'College Receipt is required';
//         return errors;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const errors = validateSignup();
//         if (Object.keys(errors).length > 0) {
//             setSignupErrors(errors);
//             return;
//         }
//         setSignupErrors({});

//         console.log(signupData)

//         const formData = new FormData();
//         Object.keys(signupData).forEach(key => {
//             formData.append(key, signupData[key]);
//         });

//         try {
//             const response = await studentPassApplication(formData);
//             if (response.ok) {
//                 setShowSuccessAlert(true);
//                 // Reset only the form fields except studentId and institute
//                 setSignupData({
//                     ...signupData,
//                     firstName: '',
//                     lastName: '',
//                     address: '',
//                     course: '',
//                     from: '',
//                     to: '',
//                     fromDate: '',
//                     toDate: '',
//                     photo: null,
//                     aadharCard: null,
//                     collegeRecipt: null,
//                 });
//                 setModalShow(false); // Close modal if open
//                 setShowErrorAlert(false); // Close error alert if open
//             } else {
//                 setShowErrorAlert(true);
//                 const errorData = await response.json();
//                 setSignupErrors({ server: errorData.message });
//             }
//         } catch (err) {
//             setShowErrorAlert(true);
//             setSignupErrors({ server: `An error occurred. Please try again. ${err.message}` });
//         }
//     };

//     // Modal component to show the selected document
//     const DocumentModal = ({ document, show, onHide }) => {
//         return (
//             <Modal show={show} onHide={onHide} size="lg" centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>View Document</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <embed src={document} type="application/pdf" width="100%" height="500px" />
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={onHide}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         );
//     };

//     // Function to handle viewing the document
//     const handleViewDocument = (document) => {
//         if (document) {
//             setSelectedDocument(URL.createObjectURL(document));
//             setModalShow(true); // Open modal only when document is clicked
//         }
//     };

//     // Effect to set toDate one year after fromDate
//     useEffect(() => {
//         if (signupData.fromDate) {
//             const fromDate = new Date(signupData.fromDate);
//             const toDate = new Date(fromDate.setFullYear(fromDate.getFullYear() + 1));
//             setSignupData({ ...signupData, toDate: toDate.toISOString().split('T')[0] });
//         }
//     }, [signupData.fromDate]);

//     return (
//         <div>
//             <Container className="container-2">
//                 <div className="form form-2">
//                     <h2 className="text-center mb-4">Apply for New Pass</h2>
//                     {showSuccessAlert && (
//                         <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
//                             Application submitted successfully!
//                         </Alert>
//                     )}
//                     {showErrorAlert && signupErrors.server && (
//                         <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
//                             {signupErrors.server}
//                         </Alert>
//                     )}
//                     <Form onSubmit={handleSubmit}>
//                         <Row>
//                             <Col xs={12} sm={6}>
//                                 <Form.Group controlId="firstName" className="pb-4">
//                                     <Form.Control
//                                         className="large-input"
//                                         type="text"
//                                         name="firstName"
//                                         value={signupData.firstName}
//                                         onChange={handleChange}
//                                         minLength="3"
//                                         isInvalid={!!signupErrors.firstName}
//                                         placeholder="First Name"
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {signupErrors.firstName}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>
//                             <Col xs={12} sm={6}>
//                                 <Form.Group controlId="lastName" className="pb-4">
//                                     <Form.Control
//                                         className="large-input"
//                                         type="text"
//                                         name="lastName"
//                                         value={signupData.lastName}
//                                         onChange={handleChange}
//                                         isInvalid={!!signupErrors.lastName}
//                                         placeholder="Last Name"
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {signupErrors.lastName}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>
//                         </Row>

//                         <Row>
//                             <Col xs={9}>
//                                 <Form.Group controlId="address" className="pb-4">
//                                     <Form.Control
//                                         className="large-input"
//                                         type="text"
//                                         name="address"
//                                         value={signupData.address}
//                                         onChange={handleChange}
//                                         isInvalid={!!signupErrors.address}
//                                         placeholder="Address"
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {signupErrors.address}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>
//                             <Col xs={3}>
//                                 Pass Amount : {signupData.passAmount}
//                             </Col>
//                         </Row>

//                         <Row>
//                             <Col xs={12} sm={4}>
//                                 <Form.Group controlId="course" className="pb-4">
//                                     <Form.Select
//                                         name="course"
//                                         value={signupData.course}
//                                         onChange={handleChange}
//                                         isInvalid={!!signupErrors.course}
//                                     >
//                                         <option value="">Select Course</option>
//                                         <option value="BCA">BCA</option>
//                                         <option value="BBA">BBA</option>
//                                         <option value="B.Com">B.Com</option>
//                                         <option value="PUC">PUC</option>
//                                         <option value="MCA">MCA</option>
//                                         <option value="MBA">MBA</option>
//                                     </Form.Select>
//                                     <Form.Control.Feedback type="invalid">
//                                         {signupErrors.course}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>

//                             <Col xs={12} sm={4}>
//                                 <Form.Group controlId="from" className="pb-4">
//                                     <Form.Control
//                                         className="large-input"
//                                         type="text"
//                                         name="from"
//                                         value={signupData.from}
//                                         onChange={handleChange}
//                                         isInvalid={!!signupErrors.from}
//                                         placeholder="From"
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {signupErrors.from}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>

//                             <Col xs={12} sm={4}>
//                                 <Form.Group controlId="to" className="pb-4">
//                                     <Form.Control
//                                         className="large-input"
//                                         type="text"
//                                         name="to"
//                                         value={signupData.to}
//                                         onChange={handleChange}
//                                         isInvalid={!!signupErrors.to}
//                                         placeholder="To"
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {signupErrors.to}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>
//                         </Row>

//                         <Row>
//                             <Col xs={12} sm={6}>
//                                 <Form.Group controlId="fromDate" className="pb-4">
//                                     <Row>
//                                         <Col xs={4} className="d-flex align-items-center">
//                                             <Form.Label>From Date</Form.Label>
//                                         </Col>
//                                         <Col xs={8}>
//                                             <Form.Control
//                                                 type="date"
//                                                 name="fromDate"
//                                                 value={signupData.fromDate}
//                                                 onChange={handleChange}
//                                                 isInvalid={!!signupErrors.fromDate}
//                                                 className="large-input"
//                                                 placeholder='From Date'
//                                             />
//                                             <Form.Control.Feedback type="invalid">
//                                                 {signupErrors.fromDate}
//                                             </Form.Control.Feedback>
//                                         </Col>
//                                     </Row>
//                                 </Form.Group>
//                             </Col>

//                             <Col xs={12} sm={6}>
//                                 <Form.Group controlId="toDate" className="pb-4">
//                                     <Row>
//                                         <Col xs={4} className="d-flex align-items-center">
//                                             <Form.Label>To Date</Form.Label>
//                                         </Col>
//                                         <Col xs={8}>
//                                             <Form.Control
//                                                 readOnly
//                                                 type="date"
//                                                 name="toDate"
//                                                 value={signupData.toDate}
//                                                 onChange={handleChange}
//                                                 isInvalid={!!signupErrors.toDate}
//                                                 className="large-input"
//                                                 placeholder='To Date'
//                                             />
//                                             <Form.Control.Feedback type="invalid">
//                                                 {signupErrors.toDate}
//                                             </Form.Control.Feedback>
//                                         </Col>
//                                     </Row>
//                                 </Form.Group>
//                             </Col>
//                         </Row>

//                         <Row>
//                             <Col xs={12} sm={3}>
//                                 Upload Photo:
//                             </Col>
//                             <Col xs={12} sm={7}>
//                                 <Form.Group controlId="photo" className="pb-4">
//                                     <Form.Control
//                                         type="file"
//                                         name="photo"
//                                         onChange={handleFileChange}
//                                         isInvalid={!!signupErrors.photo}
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {signupErrors.photo}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>
//                             <Col xs={12} sm={2}>
//                                 {signupData.photo
//                                     && <Button onClick={() => handleViewDocument(signupData.photo)}>View</Button>}
//                             </Col>
//                         </Row>

//                         <Row>
//                             <Col xs={12} sm={3}>
//                                 Upload Aadhar:
//                             </Col>
//                             <Col xs={12} sm={7}>
//                                 <Form.Group controlId="aadharCard" className="pb-4">
//                                     <Form.Control
//                                         type="file"
//                                         name="aadharCard"
//                                         onChange={handleFileChange}
//                                         isInvalid={!!signupErrors.aadharCard}
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {signupErrors.aadharCard}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>
//                             <Col xs={12} sm={2}>
//                                 {signupData.aadharCard
//                                     && <Button onClick={() => handleViewDocument(signupData.aadharCard)}>View</Button>}
//                             </Col>
//                         </Row>

//                         <Row>
//                             <Col xs={12} sm={3}>
//                                 Upload Fee Receipt:
//                             </Col>
//                             <Col xs={12} sm={7}>
//                                 <Form.Group controlId="collegeRecipt" className="pb-4">
//                                     <Form.Control
//                                         type="file"
//                                         name="collegeRecipt"
//                                         onChange={handleFileChange}
//                                         isInvalid={!!signupErrors.collegeRecipt}
//                                     />
//                                     <Form.Control.Feedback type="invalid">
//                                         {signupErrors.collegeRecipt}
//                                     </Form.Control.Feedback>
//                                 </Form.Group>
//                             </Col>
//                             <Col xs={12} sm={2}>
//                                 {signupData.collegeRecipt
//                                     && <Button onClick={() => handleViewDocument(signupData.collegeRecipt)}>View</Button>}
//                             </Col>
//                         </Row>

//                         <Button variant="primary" type="submit">
//                             Submit
//                         </Button>
//                     </Form>
//                 </div>
//             </Container>

//             <DocumentModal
//                 document={selectedDocument}
//                 show={modalShow}
//                 onHide={() => setModalShow(false)}
//             />
//         </div>
//     );
// };

// export default CitizenApplication;
