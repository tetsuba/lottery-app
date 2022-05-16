import { Component } from 'react'
import Header from '../Components/Header/Header'
import Loading from '../Components/Loading/Loading'
import Requirement from "../Components/Requirement/Requirement";
import LotteryContract, { LotteryInterface } from "../Contract/lottery"
import detectEthereumProvider from "@metamask/detect-provider"

type StateTypes = {
  balance: string
  ethereumProvider: boolean
  loading: boolean
  lotteryContract: LotteryInterface | null
  manager: string
  players: string[]
  selectedAddress: any
  requiredETH: boolean
  requiredNetwork: string
  walletLocked: boolean
  walletNetwork: string
}

export default class LotteryScreen extends Component<{}, StateTypes> {

  state = {
    balance: '',
    ethereumProvider: false,
    loading: false,
    lotteryContract: null,
    manager: '',
    players: [],
    requiredETH: false,
    requiredNetwork: 'Rinkeby',
    selectedAddress: '',
    walletLocked: false,
    walletNetwork: ''
  }

  async componentDidMount() {
    const provider: any = await detectEthereumProvider()

    if (provider && provider.isMetaMask) {
      const lotteryContract = new LotteryContract(window.ethereum)
      const network = await lotteryContract.getNetworkFromWallet()
      const address = await lotteryContract.getAddress()

      let balance = '0'
      if (address) {
        balance = await lotteryContract.getBalance(address)
      }

      this.setState({
        ethereumProvider: true,
        lotteryContract,
        walletNetwork: network,
        walletLocked: !!address, // TODO: this is wrong
        requiredETH: Number(balance) > 1,
        selectedAddress: address
      })
      await this.update()
    }
  }

  async update() {
    const lotteryContract: any = this.state.lotteryContract

    if (lotteryContract && this.requirementsMet(this.state)) {
      const players = await lotteryContract.getPlayers()
      const selectedAddress = await lotteryContract.getAddress()
      const manager = await lotteryContract.getManager()
      const balance = await lotteryContract.getBalance(lotteryContract.contractAddress)

      this.setState({
        players,
        balance,
        selectedAddress,
        manager
      })
    }
  }

  enterLottery = async () => {
    const { lotteryContract, selectedAddress } = this.state

    if (lotteryContract) {
      this.setState({ loading: true})
      try {
        // @ts-ignore
        const message = await lotteryContract.enter(selectedAddress)
        await this.update()
        console.log(message)
      } catch(e) {
        console.log(e)
      }
      this.setState({ loading: false})
    }
  }

  pickAWinner = async () => {
    const { lotteryContract, selectedAddress } = this.state

    if (lotteryContract) {
      this.setState({ loading: true})
      try {
        // @ts-ignore
        const message = await lotteryContract.pickAWinner(selectedAddress)
        await this.update()
        console.log(message)
      } catch(e) {
        console.log(e)
      }
      this.setState({ loading: false})
    }
  }

  requirementsMet(state: any) {
    const {
      requiredETH, walletNetwork, ethereumProvider, requiredNetwork, walletLocked
    } = state

    return requiredETH && ethereumProvider && walletLocked && requiredNetwork === walletNetwork
  }

  render() {
    const {
      manager, requiredETH, players, balance, walletNetwork, loading, ethereumProvider, requiredNetwork, walletLocked
    } = this.state

    return (
      <div className="App">
        { loading && <Loading/> }
        <Header />

        <div className="main-body">
          <section>
            <h2>Requirements to play</h2>
            <Requirement passed={ethereumProvider} border>
              <span>Metamask wallet installed</span>
              <span className="error">
                    Metamask wallet required. <a href="https://metamask.io/download/">Click here</a> to download
              </span>
            </Requirement>
            <Requirement passed={requiredNetwork === walletNetwork} border>
              <span>{`${requiredNetwork} Network`}</span>
              <span className="error">Please switch network to Rinkeby</span>
            </Requirement>
            <Requirement passed={walletLocked} border>
              <span>Wallet Unlocked</span>
              <span className="error">Please unlock your wallet</span>
            </Requirement>

            <Requirement passed={requiredETH}>
              <span>1 ETH</span>
              <span className="error">1 ETH required to play</span>
            </Requirement>
          </section>

          {
            this.requirementsMet(this.state) &&
              <>
                <section>
                  <button onClick={this.enterLottery}>Click here to enter lottery!</button>
                </section>
                <section>
                  <p>There are currently {players.length} players,</p>
                  <p>Competing to win {balance} ETH</p>
                  <h1>List of players</h1>
                  {
                    players.map((player, i) => <p key={`${i}player`} data-testid={'players'}>{player}</p>)
                  }
                </section>
                <section>
                  <h3>This contract is managed by <span>{manager}</span></h3>
                  <button onClick={this.pickAWinner}>Pick a winner</button>
                  <p>Note: Only a contract manager can pick a winner.</p>
                </section>
              </>
          }
        </div>
      </div>
    )
  }
}
