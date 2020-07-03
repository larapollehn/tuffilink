import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component<any, any> {
    render() {
        return (
            <div className="App">
                <header className="App-header">

                </header>
            </div>
        );
    }

    componentDidMount() {
        axios({
                url: "/api/user",
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    username: "maxmustermann",
                    password: "astrongpassword",
                    email: "max@mustermann.de"
                }
            }).then((response) => {
                console.log('Backend responded', response.data);
            }).catch((error) => {
            console.log(error);
        });
    }


}

export default App;
