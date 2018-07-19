import React, { Component } from 'react';
import {CryptographyTool} from './CryptographyTool';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <meta charSet="utf-8" /> 
          <h1 className="App-title">MemCrypt.cash</h1>
        </header>
        <div>
          <CryptographyTool/>
        </div>
      </div>
    );
  }
}
export default App;
