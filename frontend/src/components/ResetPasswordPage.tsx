import * as React from 'react';
import {toast, ToastContainer} from "react-toastify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import log from "../utils/Logger";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

/**
 * if user clicks on link in email to reset password he gets to this page
 */
class ResetPasswordPage extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.resetPassword = this.resetPassword.bind(this);
    }

    resetPassword(){
        const newPasswordInput = document.getElementById('resetNewPassword') as HTMLInputElement;
        const newPassword = newPasswordInput.value;
        const confirmPasswordInput = document.getElementById('resetConfirmPassword') as HTMLInputElement;
        const confirmPassword = confirmPasswordInput.value;
        const urlParams = new URLSearchParams(window.location.search);
        const confirmToken = urlParams.get('token');
        log.debug(confirmToken);
        if(newPassword && confirmPassword && confirmToken){
            if(newPassword === confirmPassword){
                axios({
                    method: 'PUT',
                    url: '/api/user/forgot/password/reset',
                    data: {
                        reset_password_token: confirmToken,
                        new_password: newPassword
                    }
                }).then((response) =>{
                    log.debug('User reset password successful', response.data);
                    toast.success('Great. Your password was changed, you can login now.');
                    try {
                        this.props.history.push({
                            pathname: '/',
                        })
                    } catch (e) {
                        log.debug("Error redirecting to page 'login'", e.stack);
                    }
                }).catch((error) => {
                    log.debug('Password reset not successful', error.response.data);
                    toast.error('That did not work. Please try again.');
                })
            } else {
                log.debug('Password are different');
                toast.error('Passwords do not match.')
            }
        } else {
            log.debug('Missing passwords');
            toast.error("Please complete required fields.");
        }
    }

    render() {
        return (
            <div id="home">
                <p className={"appTitle"}>tuffilink</p>

                <div id="homeScreen">
                    <ToastContainer/>
                    <p id="homeTitle">Reset your Password</p>
                    <p className="subTitle">Please enter a new password.</p>
                    <Form>
                        <Form.Group controlId="resetNewPassword">
                            <Form.Label>New Password *</Form.Label>
                            <Form.Control type="password" placeholder="Enter email"/>
                        </Form.Group>
                        <Form.Group controlId="resetConfirmPassword">
                            <Form.Label>Confirm Password *</Form.Label>
                            <Form.Control type="password" placeholder="Enter email"/>
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

export  default ResetPasswordPage;
