import Web3 from 'web3'
import CONTRACT_ABI from './CONTRACT_ABI'
import {AbiItem} from "web3-utils"
import CHAIN_LIST from './ChainId'

export interface LotteryInterface {
  web3: any,
  contract: any,
  contractAddress: string,
  contractAbi: AbiItem[] | AbiItem,
  getManager(): Promise<string>,
  getPlayers(): Promise<string[]>,
  pickAWinner(account: string): Promise<string[]>,
  enter(account: string): Promise<any>,
  getBalance(address: string): Promise<string>,
  getNetwork(): Promise<string>,
  getAddress(): Promise<string>,
  getNetworkFromWallet(): Promise<string>,
}

export const CONTRACT_ADDRESS = '0x883Bb29a36Cc585950ddda24a9DB64B2f8E32a9f'
// Manager Address:
// 0xEDf416faD4E1dc3E8B49ca82cB389D7F76E09b0A

export default class LotteryContract implements LotteryInterface {
  web3
  contract
  contractAddress = CONTRACT_ADDRESS
  contractAbi = CONTRACT_ABI

  constructor(ethereum: any) {
    this.web3 = new Web3(ethereum)
    this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress)

    // @ts-ignore
    // window.ethereum.on('accountsChanged', function () {
    //   console.log('this is working')
    // })
  }

  async getNetwork() {
    return this.contract.methods.network().call()
  }

  async getManager() {
    return this.contract.methods.manager().call()
  }

  async getPlayers() {
    return this.contract.methods.getPlayers().call()
  }

  async pickAWinner(account: string) {
    return this.contract.methods.pickWinner().send({
      from: account,
    })
  }

  // TODO: Ether amount should be set by the contract
  // TODO: write test
  async enter(account: string) {
    return this.contract.methods.enter().send({
      from: account,
      value: this.web3.utils.toWei('1', 'ether')
    })
  }

  async getBalance(address: string) {
    const wei = await this.web3.eth.getBalance(address)
    return this.web3.utils.fromWei(wei, 'ether')
  }

  // Get selected metamask wallet address
  async getAddress() {
    const address = await this.web3.eth.getAccounts()
    return address[0]
  }

  async getNetworkFromWallet() {
    const id = await this.web3.eth.net.getId()
    const network = CHAIN_LIST.find((obj) => obj.chain_id === id)
    return network ? network.network_name : ''
  }
}
