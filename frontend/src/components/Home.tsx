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

class Home extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.login = this.login.bind(this);
    }

    login(){
        const usernameInput = document.getElementById('loginUsername') as HTMLInputElement;
        const username = usernameInput.value;
        const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
        const password = passwordInput.value;
        if (username && password){
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
                try{
                    this.props.history.push({
                        pathname: '/userpage',
                        state: {
                            username: username
                        }
                    })
                } catch (e) {
                    console.log(e.stack);
                }

            }).catch((error) => {
                console.log('error', error);
            });
        } else {
            toast.error("❕ Please complete required fields.");
        }
    }

    render(){
        const token = localStorageManager.getUserToken();
        if(token){
            console.log('token exists');
            return <Userpage/>;
        } else {
            console.log('token does NOT exist');
            return (
                <div id="home">
                    <Navbar expand="lg">
                        <Navbar.Brand href="#home">tinylink</Navbar.Brand>
                    </Navbar>

                    <div id="homeScreen">
                        <ToastContainer/>
                        <p id="homeTitle">Create<br/> and share tinylinks</p>
                        <Form>
                            <Form.Group controlId="loginUsername">
                                <Form.Label>Username *</Form.Label>
                                <Form.Control type="text" placeholder="Enter username"/>
                            </Form.Group>

                            <Form.Group controlId="loginPassword">
                                <Form.Label>Password *</Form.Label>
                                <Form.Control type="password" placeholder="Password"/>
                            </Form.Group>
                        </Form>
                        <div className="btnContainer">
                            <Button variant="light" type="submit" id="loginBtn" onClick={this.login}>Login</Button>
                        </div>

                        <Container className="optionsSection">
                            <Row>
                                <Col className="register"><Link to="/register" className="register">Register Now!</Link></Col>
                                <Col className="resetPassword"><Link to="/passwordReset" className="register">Forgot
                                    Password?</Link></Col>
                            </Row>
                        </Container>
                    </div>

                    <p>Scroll down to learn more!</p>
                </div>
            )
        }
    }

    componentDidMount() {
        const token = localStorageManager.getUserToken();
        if(token){
            console.log('token exists');
        } else {
            console.log('token does NOT exist');
        }
    }

}

export default withRouter(Home);