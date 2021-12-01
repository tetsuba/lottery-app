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
    view: 'default',
    lotteryContract: null,
  }

  async componentDidMount() {

    const provider = await detectEthereumProvider()
    if (provider) {
      this.setState({
        view: 'ethereum',
        lotteryContract: new LotteryContract(window.ethereum),
      })
    }
  }

  render() {
    switch(this.state.view) {
      case 'ethereum':
        return <LotteryScreen lotteryContract={this.state.lotteryContract} />
      default:
        return <NoAccessScreen />
    }
  }
}
