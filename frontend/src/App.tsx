import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component<any, any>{
  render(){
    return (
        <div className="App">
          <header className="App-header">

          </header>
        </div>
    );
  }

  componentDidMount() {
        axios.get('https://tinylink.larapollehn.de/api/')
            .then((response) => {
            console.log('Backend responded', response.data);
        }).catch((error) => {
           console.log(error);
        });
  }


}

export default App;
