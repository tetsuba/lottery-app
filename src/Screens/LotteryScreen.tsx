import { Component } from 'react'
import Header from '../Components/Header/Header'
import { LotteryInterface } from "../Contract/lottery"

type PropTypes = {
  lotteryContract: LotteryInterface | undefined
  blockchain: string
}

type StateTypes = {
  manager: string
  players: string[]
  balance: string
  selectedAddress: any
  playersBalance: string
  network: string
}

export default class LotteryScreen extends Component<PropTypes, StateTypes> {

  state = {
    manager: '',
    players: [],
    balance: '',
    selectedAddress: '',
    playersBalance: 'Checking...',
    network: ''
  }

  async componentDidMount() {
    const { lotteryContract } = this.props
    if (lotteryContract) {
      const manager = await lotteryContract.getManager()
      const players = await lotteryContract.getPlayers()
      const selectedAddress = await lotteryContract.getAddress()
      const network = await lotteryContract.getNetwork()

      const playersBalance = selectedAddress
        ? await lotteryContract.getBalance(selectedAddress)
        : 'Please log into your wallet to check required amount is available'
      const balance = await lotteryContract.getBalance(lotteryContract.contractAddress)

      this.setState({
        manager,
        players,
        balance,
        selectedAddress,
        playersBalance,
        network
      })
    }
  }

  enterLottery = async () => {
    const { lotteryContract } = this.props
    const { selectedAddress } = this.state

    if (lotteryContract) {
      const message = await lotteryContract.enter(selectedAddress)
      console.log(message)
    }
  }

  pickAWinner = async () => {
    const { lotteryContract } = this.props
    const { selectedAddress } = this.state

    if (lotteryContract) {
      const message = await lotteryContract.pickAWinner(selectedAddress)
      console.log(message)
    }
  }

  render() {
    const { manager, players, balance, playersBalance, network } = this.state
    const { blockchain } = this.props
    return (
      <div className="App">
        <Header />

        <div className="main-body">

          <section>
            {/* hide section when player has entered lottery and show a different section*/}
            <h2>Requirements to play</h2>
            <p>Blockchain: { blockchain }</p>
            <p>Network: { network }</p>
            <p>Required amount (1 ETH): {playersBalance}</p>
            <button onClick={this.enterLottery}>Click here to enter lottery!</button>
          </section>

          <section>

            <p>There are currently {players.length} players,</p>
            <p>competing to win {balance} ETH</p>
          </section>

          <section>
            <h3>This contract is managed by {manager}</h3>
            <button onClick={this.pickAWinner}>Pick a winner</button>
            <p>Note: Only a contract manager can pick a winner.</p>
          </section>

          <section>
            <h1>List of players</h1>
            {
              players.map((player, i) => <p key={`${i}player`}>{player}</p>)
            }
          </section>
        </div>
      </div>
    )
  }
}
