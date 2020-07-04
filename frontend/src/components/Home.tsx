import * as React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "./home.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class Home extends React.Component{
    constructor(props: []) {
        super(props);
        this.state = {
            title: 'Hello World'
        }
    }

    render(){
        return(
            <div id="home">
                <Navbar  expand="lg">
                    <Navbar.Brand href="#home">tinylink</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="#home">How to</Nav.Link>
                            <Nav.Link href="#link">Change Password</Nav.Link>
                            <Nav.Link href="#link">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <div id="homeScreen">
                    <p id="homeTitle">Create<br/> and share tinylinks</p>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Button variant="light" type="submit">
                            Login
                        </Button>
                    </Form>
                </div>

                <p>Scroll down to learn more!</p>
            </div>
        )
    }

    componentDidMount() {
        console.log('Home was mounted');
    }
}

export default Home;