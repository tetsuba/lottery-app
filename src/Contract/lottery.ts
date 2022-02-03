import Web3 from 'web3'
import CONTRACT_ABI from './CONTRACT_ABI'
import {AbiItem} from "web3-utils";

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
}

// export const CONTRACT_ADDRESS = '0x4882aaF6E8961D5A7D8f9Cd01D4AC86A9a1b1D4f'
export const CONTRACT_ADDRESS = '0x0fA93117c229f2Fb838C115C0Ae0C708838c2465'

export default class LotteryContract implements LotteryInterface{
  web3
  contract
  contractAddress = CONTRACT_ADDRESS
  contractAbi = CONTRACT_ABI

  constructor(ethereum: any) {
    this.web3 = new Web3(ethereum)
    this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress)
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
    console.log('getBalance:', address)
    const wei = await this.web3.eth.getBalance(address)
    return this.web3.utils.fromWei(wei, 'ether')
  }

  // Get selected metamask wallet address
  async getAddress() {
    const address = await this.web3.eth.getAccounts()
    return address[0]
  }

  async getNetwork() {
    return this.web3.eth.net.getNetworkType()
  }
}
