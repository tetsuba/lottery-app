import Web3 from 'web3'
import CONTRACT_ABI from './CONTRACT_ABI'
import {AbiItem} from "web3-utils";

interface LotteryContractInterface {
  web3: any,
  contract: any,
  contractAddress: string,
  contractAbi: AbiItem[] | AbiItem,
  getManager(): Promise<string>,
  getPlayers(): Promise<string[]>,
  getBalance(): Promise<string>
}

export const CONTRACT_ADDRESS = '0x4882aaF6E8961D5A7D8f9Cd01D4AC86A9a1b1D4f'

export default class LotteryContract implements LotteryContractInterface{
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

  async getBalance() {
    return this.web3.eth.getBalance(this.contractAddress)
  }
}