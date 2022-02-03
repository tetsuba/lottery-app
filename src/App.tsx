import './App.css';
import { Component } from 'react';

// SCREENS
import LotteryScreen from "./Screens/LotteryScreen";
import NoAccessScreen from './Screens/NoAccessScreen';

// ETHEREUM CONTRACT
import LotteryContract from './Contract/lottery';
import detectEthereumProvider from "@metamask/detect-provider";

export default class App extends Component {

  state = {
    blockchain: 'default',
    lotteryContract: undefined,
  }

  async componentDidMount() {

    const provider = await detectEthereumProvider()
    if (provider) {
      this.setState({
        blockchain: 'ethereum',
        lotteryContract: new LotteryContract(window.ethereum),
      })
    }
  }

  render() {
    switch(this.state.blockchain) {
      case 'ethereum':
        return <LotteryScreen lotteryContract={this.state.lotteryContract} blockchain={this.state.blockchain} />
      default:
        return <NoAccessScreen />
    }
  }
}
