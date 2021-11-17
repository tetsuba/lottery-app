import { Component } from 'react';
import Header from '../Components/Header/Header';

export default class LotteryScreen extends Component {

  async componentDidMount() {
    const { lotteryContract } = this.props
    const manager = await lotteryContract.methods.manager().call()
    console.log('manager:', manager)
    //
    // console.log(lottery)

    // web3.eth.requestAccounts().then((accounts) => {
    //   console.log(accounts)
    // })
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