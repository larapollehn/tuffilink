import React from 'react';
import './App.css';
import axios from 'axios';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

class App extends React.Component<any, any> {
    render() {
        return (
            <Router basename={'/ui'}>
                <Switch>
                    <Route path={`${process.env.PUBLIC_URL}/`} exact>
                        <div className="App">
                            <header className="App-header">

                            </header>
                        </div>
                    </Route>
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
                    username: "max",
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
