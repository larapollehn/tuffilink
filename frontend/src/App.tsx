import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from "./components/Home";
import Register from "./components/Register";
import PasswordReset from "./components/PasswordReset";

class App extends React.Component<any, any> {
    render() {
        return (
            <Router basename={'/ui'}>
                <Switch>
                    <Route path={`/`} exact><Home/></Route>
                    <Route path={`/register`} exact><Register/></Route>
                    <Route path={`/passwordReset`} exact><PasswordReset/></Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
