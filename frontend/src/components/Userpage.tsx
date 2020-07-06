import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import axios from 'axios';
import localStorageManager from "../models/LocalStorage";
import log from "../utils/Logger";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";
import elephants from "./elephants_cropped.png";
import Pagination from "react-bootstrap/Pagination";
import {Chart} from 'chart.js';
import Modal from "react-bootstrap/Modal";

interface userPageProps {
}

interface userPageState {
    count: number;
    urls: [];
    userId: number,
    userName: string,
    pageSize: number;
    pageNumber: number;
    token: string;
    pagination: any,
    days: number;
    show: boolean
}

class Userpage extends React.Component<userPageProps, userPageState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            count: 0,
            urls: [],
            userId: 0,
            userName: '',
            pageNumber: 0,
            pageSize: 5,
            token: '',
            pagination: [],
            days: 7,
            show: false
        }
        this.getUrlCount = this.getUrlCount.bind(this);
        this.getUsersUrl = this.getUsersUrl.bind(this);
        this.processUrl = this.processUrl.bind(this);
        this.deleteToken = this.deleteToken.bind(this);
        this.changePage = this.changePage.bind(this);
        this.showStatistics = this.showStatistics.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.buildStatistics = this.buildStatistics.bind(this);
    }

    async getUrlCount(userId: number, token: string) {
        await axios({
            method: 'GET',
            url: `/api/url/count?user_id=${userId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            this.setState({
                count: response.data
            })
            let urls = Math.ceil(response.data / this.state.pageSize);
            log.debug('urls', urls);
            if (urls > 1) {
                let pagination = [];
                for (let i = 0; i < urls; i++) {
                    pagination.push(i);
                }
                this.setState({
                    pagination: pagination
                })
            } else {
                this.setState({
                    pagination: new Array(0)
                })
            }
            log.debug('Fetched Url count', response.data);
            return;
        }).catch((error) => {
            log.debug('Url count could not be fetched');
        })
    }

    async getUsersUrl(userId: number, token: string, pageNumber?: number) {
        log.debug(this.state.pageNumber, pageNumber);
        axios({
            method: 'GET',
            url: `/api/url?user_id=${userId}&page_size=${this.state.pageSize}&page_number=${pageNumber || this.state.pageNumber}`,
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
                this.fetchUrlData(token);
            }).catch((error) => {
                log.debug('Url could not be created.', error)
                toast.error('This url can not be transformed into a tinylink. Please try again.')
            })
        } else {
            log.debug('Token or url is missing');
            toast.error('Please enter a url we can shorten for you.');
        }
    }

    async fetchUrlData(token: string, pageNumber?: number) {
        await this.getUrlCount(this.state.userId, token).then(() => {
            log.debug('New count of urls fetched');
        }).catch(() => {
            log.debug('Url count could not be fetched');
        });
        this.getUsersUrl(this.state.userId, token, pageNumber).then(() => {
            log.debug('Urls were fetched after adding one');
        }).catch(() => {
            log.debug('Most recent urls could not be fetched');
        });
    }

    deleteToken(event: any) {
        log.debug('User wants to delete url');
        const token = localStorageManager.getUserToken();
        if (event.target.id && token) {
            const urlId = event.target.id;
            log.debug('deleting url:', token, urlId);
            axios({
                method: 'DELETE',
                url: `/api/url/${urlId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                log.debug('User deleted an url, id:', urlId);
                if ((this.state.count - 1) % this.state.pageSize === 0) {
                    let nextPage = this.state.pageNumber - 1;
                    this.setState({
                        pageNumber: nextPage
                    })
                }
                this.fetchUrlData(token);
            }).catch((error) => {
                log.debug('Deleting url did not work', error.stack);
            })
        } else {
            log.debug('Id of url not identified from clicked button or token missing');
            toast.error('That did not work. Refresh the page and please try again.')
        }
    }

    changePage(event: any) {
        let page = event.target.id;
        log.debug('User changed page', page);
        if (page) {
            this.setState({
                pageNumber: page
            });
        } else {
            log.debug('page number not valid');
        }
        let token = localStorageManager.getUserToken();
        if (token) {
            this.getUsersUrl(this.state.userId, token, page).then(() => {
                log.debug('New state of urls fetched');
            }).catch(() => {
                log.debug('Urls could not be fetched');
            });

        } else {
            log.debug('token not valid, next few urls could not be fetched');
        }
    }

    showStatistics(event: any) {
        let urlId = event.target.id;
        let token = localStorageManager.getUserToken();
        if (token && urlId) {
            axios({
                method: 'GET',
                url: `/api/click?link_id=${urlId}&days=${this.state.days}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                log.debug('Statistics for clicked url', response.data);
                this.setState({
                    show: true
                });
                this.buildStatistics(response.data);
            }).catch((error) => {
                log.debug('Statistics could not be fetched', error.stack);
            })
        } else {
            log.debug('token not valid, statistics could not be fetched');
        }
    }

    handleClose() {
        this.setState({
            show: false
        });
    }

    buildStatistics(data: []) {
        console.log(data);
        const mappingData = new Map();
        for (let i = 0; i <= 7; i++) {
            const currentDate = new Date();
            currentDate.setHours(0);
            currentDate.setMinutes(0);
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);
            currentDate.setDate(currentDate.getDate() - i);
            mappingData.set(currentDate, 0);
        }
        for (let i = 0; i < data.length; i++) {
            mappingData.set(new Date(data[i]["day"]), Number(data[i]["count"]));
        }
        const displayingData = new Map();
        const keys = Array.from(mappingData.keys());
        for (let i = 0; i < keys.length; i++) {
            displayingData.set(`${keys[i].getDate()}.${keys[i].getMonth() + 1}`, mappingData.get(keys[i]));
        }
        console.log(displayingData);
        // @ts-ignore
        const ctx = document.getElementById('myChart').getContext('2d');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from(displayingData.keys()).reverse(),
                datasets: [{
                    label: 'Number of daily clicks',
                    backgroundColor: 'rgb(226,109,90)',
                    borderColor: 'rgb(226,109,90)',
                    data: Array.from(displayingData.values()).reverse()
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            stepSize: 1
                        }
                    }]
                }
            }
        });
    }

    render() {
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
                                <Link id={"logoutLink"} className={"nav-link"} to="/">Logout</Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Statistics for the last {this.state.days} days</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <canvas id="myChart"></canvas>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <img className={"elephantLogo"} src={elephants} alt="elephant-logo"/>
                <div className="shortUserPageContainer">
                    <p id="homeTitle">Shorten urls now. Use and share whenever!</p>
                </div>

                <div id="urlInput">
                    <Form>
                        <Form.Group controlId="longUrl">
                            <Form.Control type="text" placeholder="https://example.com/way/too/long"/>
                        </Form.Group>
                        <Button variant="light" type="submit" className="goBtn" onClick={this.processUrl}>
                            Go
                        </Button>
                    </Form>

                    <Card className={"urlCard"}>
                        <Pagination>
                            {
                                this.state.pagination.map((page: number, i: number) =>
                                    <Pagination.Item key={i} id={i}
                                                     onClick={this.changePage}>{page + 1}</Pagination.Item>
                                )
                            }
                        </Pagination>
                        {
                            this.state.urls.map((url: { shorturl: string, originalurl: string, visit_count: number, id: number }, i: number) =>
                                <ListGroup horizontal={"sm"} className="my-2" key={i}>
                                    <ListGroup.Item className={"statisticGroupItem"}>
                                        <button id={String(url['id'])} className={"deleteBtn"}
                                                onClick={this.showStatistics}>
                                            <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                 className="bi bi-bar-chart-line" fill="currentColor"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd"
                                                      d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5h-2v12h2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                                                <path fillRule="evenodd"
                                                      d="M0 14.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/>
                                            </svg>
                                        </button>
                                    </ListGroup.Item>
                                    <ListGroup.Item className={"firstGroupItem"}><a className={"tinylinkItem"}
                                                                                    href={`https://tinylink.larapollehn.de/${url['shorturl']}`}>https://tinylink.larapollehn.de/{url['shorturl']}</a></ListGroup.Item>
                                    <ListGroup.Item className={"originalUrlItem"}> {url['originalurl']}</ListGroup.Item>
                                    <ListGroup.Item className={"countGroupItem"}>
                                            <span className="badge badge-primary">
                                            {url['visit_count']} click(s)</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item className={"deleteGroupItem"}>
                                        <button id={String(url['id'])} className={"deleteBtn"}
                                                onClick={this.deleteToken}>
                                            <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                 className="bi bi-trash-fill" fill="currentColor"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fillRule="evenodd"
                                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                        </button>
                                    </ListGroup.Item>
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

        let logoutLink = document.getElementById('logoutLink');
        logoutLink?.addEventListener('click', () => {
            log.debug('user logged out');
            localStorageManager.deleteToken();
        })
    }


}

export default Userpage;