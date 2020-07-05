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
import log from "../utils/Logger";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";

interface userPageProps {
}

interface userPageState {
    count: number[];
    urls: [];
    userId: number,
    userName: string,
    pageSize: number;
    pageNumber: number;
    token: string;
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
            pageSize: 5,
            token: ''
        }
        this.getUrlCount = this.getUrlCount.bind(this);
        this.getUsersUrl = this.getUsersUrl.bind(this);
        this.processUrl = this.processUrl.bind(this);
        this.deleteToken = this.deleteToken.bind(this);
    }

    async getUrlCount(userId: number, token: string) {
        await axios({
            method: 'GET',
            url: `/api/url/count?user_id=${userId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            log.debug(response.data);
            return;
        }).catch((error) => {
            log.debug('Url count could not be fetched');
        })
    }

    async getUsersUrl(userId: number, token: string) {
        axios({
            method: 'GET',
            url: `/api/url?user_id=${userId}&page_size=${this.state.pageSize}&page_number=${this.state.pageNumber}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            log.debug('Users urls', response.data);
            if (response.data) {
                this.setState({
                    urls: response.data
                })
            }
            return;
        }).catch((error) => {
            log.debug("Error trying to fetch user's urls from database:", error.response.data)
        });
    }

    processUrl() {
        const urlInput = document.getElementById('longUrl') as HTMLInputElement;
        const longUrl = urlInput.value;
        const token = localStorageManager.getUserToken();
        log.debug('The Following url was requested to be shortened:', longUrl);
        if (longUrl && token) {
            axios({
                method: 'POST',
                url: '/api/url',
                data: {
                    "original_url": longUrl
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                log.debug('Url successfully created');
                toast.success('We created a tinylink for you.')
                this.getUsersUrl(this.state.userId, token).then(() => {
                    log.debug('Urls were fetched after adding one');
                }).catch(() => {
                    log.debug('Most recent urls could not be fetched');
                });
            }).catch((error) => {
                log.debug('Url could not be created.', error)
                toast.error('This url can not be transformed into a tinylink. Please try again.')
            })
        } else {
            log.debug('Token or url is missing');
        }

    }

    deleteToken(event: any) {
        log.debug('User wants to delete url');
        const token = localStorageManager.getUserToken();
        if (event.target.id && token) {
            const urlId = event.target.id;
            axios({
                method: 'DELETE',
                url: `/api/url/${urlId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                log.debug('User deleted an url, id:', urlId);
                this.getUsersUrl(this.state.userId, token).then(() => {
                    log.debug('New state of urls fetched');
                }).catch(() => {
                    log.debug('Urls could not be fetched');
                })
            }).catch((error) => {
                log.debug('Deleting url did not work', error);
            })
        } else {
            log.debug('Id of url not identified from clicked button or token missing');
            toast.error('That did not work. Refresh the page and please try again.')
        }
    }

    render() {
        console.log('render');
        return (
            <div id="userpageContainer">
                <ToastContainer/>
                <Navbar expand="lg">
                    <Navbar.Brand href="/">tinylink</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="#home">How to</Nav.Link>
                            <Link className={"nav-link"} to="/changePassword">Change Password</Link>
                            <Nav.Link href="#home">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div id="userpage">
                    <p id="userpageTitle">Shorten your urls. Use and share whenever!</p>
                    <div id="urlInput">
                        <Form>
                            <Form.Group controlId="longUrl">
                                <Form.Control type="text" placeholder="https://example.com/way/too/long"/>
                            </Form.Group>
                        </Form>
                        <Button variant="dark" type="submit" onClick={this.processUrl}>
                            Go
                        </Button>
                    </div>
                    <Card>
                        <ListGroup variant="flush">
                            {
                                this.state.urls.map((url, i) =>
                                    <ListGroup.Item key={i}>
                                        <a href={`https://tinylink.larapollehn.de/${url['shorturl']}`}
                                           target="_blank">https://tinylink.larapollehn.de/{url['shorturl']}</a>
                                        <br></br>
                                        {url['originalurl']}
                                        <br></br>
                                        <button id={url['id']} onClick={this.deleteToken}>Delete</button>
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                    </Card>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const token = localStorageManager.getUserToken();
        const userInfo = localStorageManager.getUserInfoFromToken();
        const userId = userInfo['id'];
        const userName = userInfo['username'];
        log.debug('Current user information, ready to fetch urls from db:', userInfo);
        this.setState({
            userId: userId,
            userName: userName
        });
        if (userId && userName && token) {
            this.getUsersUrl(userId, token).then(() => {
                log.debug('Urls were fetched');
            }).catch((error) => {
                log.debug('Urls could not be fetched from database');
            });
            this.getUrlCount(userId, token).then(() => {
                log.debug('Url Count was fetched');
            }).catch((error) => {
                log.debug('Url count could not be fetched from database');
            });
        } else {
            log.debug('Userdata is missing');
        }
    }


}

export default Userpage;