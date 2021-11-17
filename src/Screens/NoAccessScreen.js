import { Component } from 'react';
import Header from '../Components/Header/Header';

export default class NoAccessScreen extends Component {

  render() {
    return (
      <div className="App">
        <h1>Can not connect to ethereum wallet</h1>
        <Header />
      </div>
    )
  }
}