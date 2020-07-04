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

class PasswordReset extends React.Component {
    constructor(props: {}) {
        super(props);
        this.resetPassword = this.resetPassword.bind(this);
    }

    resetPassword() {
        const emailInput = document.getElementById('resetPasswordEmail') as HTMLInputElement;
        const email = emailInput.value;
        if (email) {
            axios({
                url: "/api/user/forgot/password",
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    email: email
                }
            }).then(() => {
                toast.info("We send a mail to the given email address with a link to change the password.");
            }).catch(() => {
                toast.error('Something went wrong. Please try again.');
            });
        } else {
            toast.error("❕ Please complete required fields.");
        }
    }

    render() {
        return (
            <div id="home">
                <Navbar expand="lg">
                    <Navbar.Brand href="#home">tinylink</Navbar.Brand>
                </Navbar>

                <div id="homeScreen">
                    <ToastContainer/>
                    <p id="homeTitle">Forgot your Password?<br/>Don't worry.</p>
                    <Form>
                        <Form.Group controlId="resetPasswordEmail">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"/>
                        </Form.Group>
                    </Form>
                    <div className="btnContainer">
                        <Button variant="light" type="submit" id="loginBtn" onClick={this.resetPassword}>Reset</Button>
                    </div>

                    <Container className="optionsSection">
                        <Row>
                            <Col className="register"><Link to="/" className="register">Login</Link></Col>
                            <Col className="resetPassword"><Link to="/register" className="register">Register
                                Now!</Link></Col>
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}

export default PasswordReset;