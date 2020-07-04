import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from "./components/Home";

class App extends React.Component<any, any> {
    render() {
        return (
            <Router basename={'/ui'}>
                <Switch>
                    <Route path={`/`} exact><Home/></Route>
                </Switch>
            </Router>
        );
    }

    componentDidMount() {
        axios({
                url: "/api/user/login",
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    username: "max4",
                    password: "max"
                }
            }).then((response) => {
                console.log('Backend responded', response.data);
            }).catch((error) => {
            console.log(error);
        });
    }


}

export default App;
