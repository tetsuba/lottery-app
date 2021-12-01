import { Component } from 'react';
import Header from '../Components/Header/Header';

type LotteryScreenProps = {
  lotteryContract: any;
}

export default class LotteryScreen extends Component<LotteryScreenProps> {

  async componentDidMount() {
    const { lotteryContract } = this.props
    console.log(lotteryContract.contractAbi)
    const manager = await lotteryContract.getManager()
    const players = await lotteryContract.getPlayers()
    const balance = await lotteryContract.getBalance()
    console.log('manager:', manager)
    console.log('players:', players)
    console.log('balance:', balance)
  }

  render() {
    return (
      <div className="App">
        <h1>Ethereum Context</h1>
        <Header />
      </div>
    )
  }
}