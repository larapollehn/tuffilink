import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./userpage.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import axios from 'axios';
import localStorageManager from "../models/LocalStorage";

interface userPageProps {
}

interface userPageState {
    count: number[];
    urls: [];
    userId: number,
    userName: string,
    pageSize: number;
    pageNumber: number;
}



class Userpage extends React.Component<userPageProps, userPageState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            count: [1, 2, 3, 4],
            urls: [],
            userId: 0,
            userName: '',
            pageNumber: 0,
            pageSize: 5
        }
    }

    render() {
        return (
            <div id="userpageContainer">
                <Navbar expand="lg">
                    <Navbar.Brand href="#home">tinylink</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="#home">How to</Nav.Link>
                            <Nav.Link href="#link">Change Password</Nav.Link>
                            <Nav.Link href="#home">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div id="userpage">
                    <p id="userpageTitle">Shorten your urls. Use and share whenever!</p>
                    <div id="urlInput">
                        <Form>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Control type="text" placeholder="https://example.com/way/too/long" />
                            </Form.Group>
                        </Form>
                        <Button variant="dark" type="submit">
                            Go
                        </Button>
                    </div>
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    Show me my tinylinks
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <ListGroup variant="flush">
                                    <ListGroup.Item><a>www.youtube.de</a> www.youtube.de/hjhdkfasj/fjdsfkjdhskfh/kfjsadhfkjhds</ListGroup.Item>
                                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                </ListGroup>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
            </div>
        );
    }

    componentDidMount() {
        let token = localStorageManager.getUserInfoFromToken();
        let userId = token['id'];
        let userName = token['username'];
        this.setState({
            userId: userId,
            userName:userName
        });

        if(userId && userName){
            axios({
                method: 'GET',
                url: `/api/url?user:id=${userId}&page_size=${this.state.pageSize}&page_number=${this.state.pageNumber}`,
            }).then((response) => {

            }).catch((error) => {

            });
        }
    }


}

export default Userpage;