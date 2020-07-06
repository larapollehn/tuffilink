import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from "./components/Home";
import Register from "./components/Register";
import PasswordReset from "./components/PasswordReset";
import Userpage from "./components/Userpage";
import ChangePassword from "./components/ChangePassword";
import Page404 from "./components/Page404";
import ResetPasswordPage from "./components/ResetPasswordPage";

class App extends React.Component<any, any> {
    render() {
        return (
            <Router basename={'/ui'}>
                <Switch>
                    <Route path={`/`} exact><Home/></Route>
                    <Route path={`/register`} ><Register/></Route>
                    <Route path={`/passwordReset`} ><PasswordReset/></Route>
                    <Route path={`/userpage`} ><Userpage/></Route>
                    <Route path={`/changePassword`} ><ChangePassword/></Route>
                    <Route path={`/404`} exact><Page404/></Route>
                    <Route path={`/forgotpassword`} exact><ResetPasswordPage/></Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
