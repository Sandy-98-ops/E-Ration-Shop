import React from 'react'
import { NavLink } from 'react-router-dom'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import logo from '../../utils/KSRTC.jpg'

const NavBar = () => {
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" variant="light">
                <Container>
                    <Navbar.Brand href="/home">
                        <img
                            src={logo}
                            height="30"
                            className="d-inline-block align-top"
                            alt="Logo"
                        /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
                            <Nav.Link as={NavLink} to="/register">Register</Nav.Link>

                            <NavDropdown title="Login" id="collasible-nav-dropdown">
                                <NavDropdown.Item as={NavLink} to="/guestLayout/userLogin">User Login</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/guestLayout/retailerLogin">Retailer Login</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/guestLayout/distributorLogin">Distributor Login</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </div>
    )
}

export default NavBar
