import * as React from 'react';
import Navbar from "react-bootstrap/Navbar";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import axios from "axios";
import localStorageManager from "../models/LocalStorage";


class Register extends React.Component{
    constructor(props: {}) {
        super(props);
        this.register = this.register.bind(this);
    }

    register(){
        const emailInput = document.getElementById('registerEmail') as HTMLInputElement;
        const email = emailInput.value;
        const usernameInput = document.getElementById('registerUsername') as HTMLInputElement;
        const username = usernameInput.value;
        const passwordInput = document.getElementById('registerPassword') as HTMLInputElement;
        const password = passwordInput.value;
        if(email && username && password){
            axios({
                url: "/api/user",
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    username: username,
                    password: password,
                    email: email
                }
            }).then((response) => {
                console.log('user registration successful');
            }).catch((error) => {
                toast.error(error.response.data)
            });
        } else {
            toast.error("❕ Please complete required fields.");
        }
    }

    render() {
        return (
            <div id="home">
                <Navbar  expand="lg">
                    <Navbar.Brand href="#home">tinylink</Navbar.Brand>
                </Navbar>

                <div id="homeScreen">
                    <ToastContainer/>
                    <p id="homeTitle">Create<br/> and share tinylinks</p>
                    <Form>
                        <Form.Group controlId="registerEmail">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="registerUsername">
                            <Form.Label>Username *</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" />
                        </Form.Group>

                        <Form.Group controlId="registerPassword">
                            <Form.Label>Password *</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                    </Form>
                    <div className="btnContainer">
                        <Button variant="light" type="submit" id="registerBtn" onClick={this.register}>Register</Button>
                    </div>

                    <Container className="optionsSection">
                        <Row>
                            <Col className="register"><Link to="/" className="register">Login</Link></Col>
                            <Col className="resetPassword"><a href="#" className="resetPassword">Forgot Password?</a></Col>
                        </Row>
                    </Container>
                </div>

                <p>Scroll down to learn more!</p>
            </div>
        );
    }
}

export default Register;