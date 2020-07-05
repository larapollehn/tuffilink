import * as React from 'react';
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
            toast.error("Please complete required fields.");
        }
    }

    render() {
        return (
            <div id="home">
                <p className={"appTitle"}>tuffilink</p>

                <div id="homeScreen">
                    <ToastContainer/>
                    <p id="homeTitle">Forgotten your Password?<br/>Don't worry.</p>
                    <p className="subTitle">Enter your account email address to receive an email to reset your password.</p>
                    <Form>
                        <Form.Group controlId="resetPasswordEmail">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"/>
                        </Form.Group>
                    </Form>
                    <div className="btnContainer">
                        <Button variant="light" type="submit" id="loginBtn" className={"homeBtn"} onClick={this.resetPassword}>Reset</Button>
                    </div>

                    <Container className="optionsSection">
                        <Row>
                            <Col className="register"><Link to="/" className="pageDirection">Back to Login</Link></Col>
                            <Col className="resetPassword"><Link to="/register" className="pageDirection">Register
                                Now!</Link></Col>
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}

export default PasswordReset;