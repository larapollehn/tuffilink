import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from "./components/Home";
import Register from "./components/Register";
import PasswordReset from "./components/PasswordReset";
import Userpage from "./components/Userpage";
import ChangePassword from "./components/ChangePassword";

class App extends React.Component<any, any> {
    render() {
        return (
            <Router basename={'/ui'}>
                <Switch>
                    <Route path={`/`} exact><Home/></Route>
                    <Route path={`/register`} exact><Register/></Route>
                    <Route path={`/passwordReset`} exact><PasswordReset/></Route>
                    <Route path={`/userpage`} exact><Userpage/></Route>
                    <Route path={`/changePassword`} exact><ChangePassword/></Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
