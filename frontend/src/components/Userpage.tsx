import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";
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
import elephants from "./elephants_cropped.png";
import {EventHandler} from "react";

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

    processUrl(event: any) {
        event.preventDefault();
        console.log('clicked process url');
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
            toast.error('Please enter a url we can shorten for you.');
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
                <div className="userpageNav">
                    <Navbar expand="lg">
                        <Navbar.Brand><Link className={"appTitle"} to="/">tuffilink</Link></Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                                <Link className={"nav-link"} to="/changePassword">Change Password</Link>
                                <Link className={"nav-link"} to="/">Logout</Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>

                <img className={"elephantLogo"} src={elephants} alt="elephant-logo"/>
                <div className="shortUserPageContainer">
                    <p id="homeTitle">Shorten urls now. Use and share whenever!</p>
                </div>

                <div id="urlInput">
                    <Form>
                        <Form.Group controlId="longUrl">
                            <Form.Control type="text" placeholder="https://example.com/way/too/long"/>
                        </Form.Group>
                        <Button variant="light" type="submit" className="homeBtn" onClick={this.processUrl}>
                            Go
                        </Button>
                    </Form>

                    <Card className={"urlCard"}>
                        {
                            this.state.urls.map((url: { shorturl: string, originalurl: string, visit_count: number, id: number }, i: number) =>
                                    <ListGroup horizontal={"sm"} className="my-2" key={i}>
                                        <ListGroup.Item ><a className={"tinylinkItem"} href={`https://tinylink.larapollehn.de/${url['shorturl']}`}>https://tinylink.larapollehn.de/{url['shorturl']}</a></ListGroup.Item>
                                        <ListGroup.Item className={"originalUrlItem"}> {url['originalurl']}</ListGroup.Item>
                                        <ListGroup.Item>clicked: {url['visit_count']}</ListGroup.Item>
                                        <ListGroup.Item><button id={String(url['id'])} className={"deleteBtn"} onClick={this.deleteToken}>
                                            <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                 className="bi bi-trash-fill" fill="currentColor"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                      d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                            </svg></button></ListGroup.Item>
                                    </ListGroup>
                                )
                        }
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