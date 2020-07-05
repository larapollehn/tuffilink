import * as React from 'react';
import Navbar from "react-bootstrap/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./home.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {withRouter} from 'react-router-dom';


import localStorageManager from "../models/LocalStorage";
import {Link} from "react-router-dom";
import Userpage from "./Userpage";
import log from "../utils/Logger";
import elephants from "./elephants_cropped.png";

class Home extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.login = this.login.bind(this);
    }

    login() {
        const usernameInput = document.getElementById('loginUsername') as HTMLInputElement;
        const username = usernameInput.value;
        const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
        const password = passwordInput.value;
        log.debug("User logging info:", username, password);
        if (username && password) {
            axios({
                url: "/api/user/login",
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    username: username,
                    password: password
                }
            }).then((response) => {
                localStorageManager.saveUserToken(response.data);
                log.debug("Backend response with ", response.data);
                try {
                    this.props.history.push({
                        pathname: '/userpage',
                        state: {
                            username: username
                        }
                    })
                } catch (e) {
                    log.debug("Error redirecting to page 'userpage'", e.stack);
                }

            }).catch((error) => {
                log.debug('error', error);
            });
        } else {
            toast.error("❕ Please complete required fields.");
        }
    }

    render() {
        const token = localStorageManager.getUserToken();
        if (token !== null) {
            log.debug('token exists and can be trusted. Redirecting to user page now');
            return <Userpage/>;
        } else {
            log.debug('token does NOT exist');
            return (
                <div id="home">
                    <p className={"appTitle"}>tuffilink</p>

                    <div id="homeScreen">
                        <ToastContainer/>
                        <img className={"elephantLogo"} src={elephants} alt="elephant-logo"/>
                        <p id="homeTitle">Create And Share Tinylinks</p>
                        <p className="subTitle">Save time and confusion by using shortened links, reusable and easy to remember.</p>
                        <Form>
                            <Form.Group controlId="loginUsername">
                                <Form.Control type="text" placeholder="Username *"/>
                            </Form.Group>

                            <Form.Group controlId="loginPassword">
                                <Form.Control type="password" placeholder="Password *"/>
                            </Form.Group>
                        </Form>
                        <div className="btnContainer">
                            <Button variant="light" type="submit" id="loginBtn" className="homeBtn" onClick={this.login}>Login</Button>
                        </div>

                        <Container className="optionsSection">
                            <Row>
                                <Col className="register"><Link to="/register" className="pageDirection">Register Now!</Link></Col>
                                <Col className="resetPassword"><Link to="/passwordReset" className="pageDirection">Forgot
                                    Password?</Link></Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            )
        }
    }

    componentDidMount() {
        const token = localStorageManager.getUserToken();
        if (token !== null) {
            log.debug('token exists');
        } else {
            log.debug('token does NOT exist');
        }
    }

}

export default withRouter(Home);