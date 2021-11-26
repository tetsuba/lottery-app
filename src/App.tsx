import './App.css';
import { Component } from 'react';

// SCREENS
import LotteryScreen from "./Screens/LotteryScreen";
import NoAccessScreen from './Screens/NoAccessScreen';

// ETHEREUM CONTRACT
import LotteryContract from './Contract/lottery';

export default class App extends Component {

  state = {
    view: 'default',
    metaMaskMessage: '',
    lotteryContract: null,
  }

  async componentDidMount() {
    const contract = await LotteryContract();
    if (contract) {
      this.setState({
        view: 'ethereum',
        lotteryContract: contract,
      })
    } else {
      this.setState({
        metaMaskMessage: 'Please set up a metamask wallet',
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

