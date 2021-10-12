import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'

export default function NavbarStudent() {
    const id = localStorage.getItem('id');
    return (
        <Navbar bg="dark" variant="dark">
            <Nav className="container-fluid">
                <Nav.Item className="ml-auto">
                    <Nav.Link href={`/result/${id}`}>Result</Nav.Link>
                    <Nav.Link href={`/student-dashboard/${id}`}>Advising Panel</Nav.Link>
                    <Nav.Link href={`/logout`}>Logout</Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    )
}
