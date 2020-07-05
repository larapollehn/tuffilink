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
            toast.error('❕ Please complete required fields.');
        }
    }

    render() {
        return (
            <div id="changePassword">
                <ToastContainer/>
                <Navbar expand="lg">
                    <Navbar.Brand href="#home">tinylink</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="#home">How to</Nav.Link>
                            <Link className={"nav-link"} to="/changePassword">Change Password</Link>
                            <Nav.Link href="#home">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div id="homeScreen">
                    <p id="homeTitle">Want to change your Password?<br/>Go ahead.</p>
                    <Form>
                        <Form.Group controlId="changePasswordInput">
                            <Form.Label>New Password *</Form.Label>
                            <Form.Control type="password" placeholder="Enter new password"/>
                        </Form.Group>
                    </Form>
                    <div className="btnContainer">
                        <Button variant="light" type="submit" id="loginBtn" onClick={this.changePassword}>Change
                            Password</Button>
                    </div>

                </div>
            </div>
        )
    }
}

export default ChangePassword;