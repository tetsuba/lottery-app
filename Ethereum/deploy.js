import HDWalletProvider from '@truffle/hdwallet-provider'
import Web3 from 'web3'
import { lotteryContract } from './compile.js'

function getENV() {
  return {
    /* Used for testing */
    TEST: !!process.env.TEST,
    GANACHE_URL: process.env.GANACHE_URL,

    /* Used for deploying a contract */
    RINKEBY: !!process.env.RINKEBY,
    RINKEBY_KEY: process.env.RINKEBY_KEY,
    RINKEBY_URL: process.env.RINKEBY_URL
  }
}

function log(lottery, accounts) {
  console.log(lotteryContract.abi)
  console.log('Contract deployed to', lottery.options.address)
  console.log('Manager Address: ', accounts[0])
}

export function getProvider () {
  const ENV = getENV()
  switch (true) {
    case ENV.RINKEBY:
      return (ENV.RINKEBY_KEY && ENV.RINKEBY_URL)
        ? new HDWalletProvider(ENV.RINKEBY_KEY, ENV.RINKEBY_URL)
        : 'Rinkeby test success'
    default: // ENV.TEST
      return ENV.GANACHE_URL
  }
}

export default async function deploy() {
  const ENV = getENV()
  const provider = getProvider()
  const web3 = new Web3(provider)
  const accounts = await web3.eth.getAccounts()

  const lottery = await new web3.eth
    .Contract(lotteryContract.abi)
    .deploy({
      data: lotteryContract.evm.bytecode.object.toString(),
    })
    .send({
      from: accounts[0],
      gas: 1000000
    })

  // Log data if deploying to Rinkeby network
  if (ENV.RINKEBY) log(lottery, accounts)

  // Return data if testing deploy
  if (ENV.TEST) return { lottery, accounts, web3 }

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
