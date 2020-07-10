import * as React from 'react';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import log from "../utils/Logger";
import localStorageManager from "../models/LocalStorage";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

/**
 * User can change password when logged in.
 * Authorization per token
 */
class ChangePassword extends React.Component {
    constructor(props: {}) {
        super(props);
        this.changePassword = this.changePassword.bind(this);
    }

    changePassword() {
        const newPasswordInput = document.getElementById('changePasswordInput') as HTMLInputElement;
        const newPassword = newPasswordInput.value;
        const token = localStorageManager.getUserToken();
        log.debug('User wants to change account password', token, newPassword);
        if (newPassword && token) {
            log.debug('Information exists');
            axios({
                method: 'PUT',
                url: '/api/user/password',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    new_password: newPassword
                }
            }).then((response) => {
                log.debug('Password of user successfully changed', response);
                toast.success("We changed your password. Don't forget for next login.");
            }).catch((error) => {
                log.debug('Password could not be changed', error);
                toast.error('That did not work. Please try again.');
            })
        } else {
            log.debug('New Password or token missing');
            toast.error('Please complete required fields.');
        }
    }

    render() {
        return (
            <div id="changePassword">
                <ToastContainer/>
                <div className="userpageNav">
                    <Navbar expand="lg">
                        <Navbar.Brand><Link className={"appTitle"} to="/">tuffilink</Link></Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                                <Link className={"nav-link"} to="/changePassword">Change Password</Link>
                                <Link id={"logoutLink"} className={"nav-link"} to="/">Logout</Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div id="homeScreen">
                    <p id="homeTitle">Want to change your Password?</p>
                    <p className="subTitle">Just enter a new password and we'll do the rest.</p>
                    <Form>
                        <Form.Group controlId="changePasswordInput">
                            <Form.Label>New Password *</Form.Label>
                            <Form.Control type="password" placeholder="Enter new password"/>
                        </Form.Group>
                    </Form>
                    <div className="btnContainer">
                        <Button variant="light" type="submit" id="loginBtn"  className="homeBtn"  onClick={this.changePassword}>Change
                            Password</Button>
                    </div>
                    <Container className="optionsSection">
                        <Row>
                            <Col className="register"><Link to="/userpage" className="pageDirection">Back to Home</Link></Col>
                        </Row>
                    </Container>

                </div>
            </div>
        )
    }

    componentDidMount() {
        /**
         * Event Listener for Logout Button, when user wants to logout of app
         */
        let logoutLink = document.getElementById('logoutLink');
        logoutLink?.addEventListener('click',() => {
            log.debug('user logged out');
            localStorageManager.deleteToken();
        })
    }
}

export default ChangePassword;
