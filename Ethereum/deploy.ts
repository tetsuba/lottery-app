// @ts-ignore
import HDWalletProvider from '@truffle/hdwallet-provider'
import Web3 from 'web3'
import { lotteryContract } from './compile'
import Env from './env'
import { print } from "./utils"
import { AbstractProvider } from "web3-core"

export function getProvider (): AbstractProvider | string {
  const env = Env()
  switch (true) {
    case env.RINKEBY:
      return (env.RINKEBY_KEY && env.RINKEBY_URL)
        ? new HDWalletProvider(env.RINKEBY_KEY, env.RINKEBY_URL)
        : 'Rinkeby test success'
    default: // ENV.TEST
      return env.GANACHE_URL
  }
}

// deploy only returns a value for testing
export default async function deploy() {
  const env = Env()
  const provider = getProvider()
  const web3 = new Web3(provider)
  const accounts = await web3.eth.getAccounts()
  const lottery = await new web3.eth
    .Contract(lotteryContract.abi)
    .deploy({
      data: lotteryContract.evm.bytecode.object.toString(),
      arguments: ['Rinkeby']
    })
    .send({
      from: accounts[0],
      gas: 1000000
    })


  // Log data if deploying to Rinkeby network
  if (env.RINKEBY) {
    const printData = [
      lotteryContract.abi,
      'Contract deployed to', lottery.options.address,
      'Manager Address: ', accounts[0]
    ]
    print(printData, false)
  }

  // Return data if testing deploy
  if (env.TEST) return ({ lottery, accounts, web3 })

  // @ts-ignore
  provider.engine.stop();
}

/* NOTE:
 * It is possible to import a package to call a function that
 * will remove this code below.
 *
 * The only reason for exporting functions in this script is for testing.
 *
 * The main call for this script is in the package.json script.
 * */
if (process.env.RINKEBY) deploy().then()
