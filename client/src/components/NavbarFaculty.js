import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'

export default function NavbarFaculty() {
    const id = localStorage.getItem('id');
    return (
        <Navbar bg="dark" variant="dark">
            <Nav className="container-fluid">
                <Nav.Item className="ml-auto">
                    <Nav.Link href={`/logout`}>Logout</Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    )
}
