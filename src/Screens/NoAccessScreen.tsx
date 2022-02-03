import { Component } from 'react';

export default class NoAccessScreen extends Component {

  render() {
    return (
      <div className="App">
        <h1>You need a metamask wallet and ethereum to play!</h1>

        <h2>Installing Metamask</h2>
          <ol>
              <li>Go to the Metamask website.</li>
              <li>Click “Get Chrome Extension” to install Metamask.</li>
              <li>Click “Add to Chrome” in the upper right.</li>
              <li>Click “Add Extension” to complete the installation.</li>
              <li>You will know Metamask has been installed when you see the fox logo on the upper right hand corner of your browser.</li>
          </ol>

        <img src="https://miro.medium.com/max/246/0*GBRItIWpHH4_Zwtv" alt="" />

        <h2>Get some ethereum on the Rinkeby test network</h2>
        <p>ethereum</p>
        <a href="https://www.rinkeby.io/#faucet" target="_blank" rel="noopener noreferrer">faucet</a>
      </div>
    )
  }
}