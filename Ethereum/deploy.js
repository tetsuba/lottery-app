import HDWalletProvider from '@truffle/hdwallet-provider'
import Web3 from 'web3'
import contracts from './compile.js'

const init = async function() {
  const provider = await new HDWalletProvider(
    process.env.RINKEBY_KEY,
    process.env.RINKEB_URL
  )
  const web3 = new Web3(provider)
  const accounts = await web3.eth.getAccounts()

  // TODO: Find a better way to call a specific contract
  const contract = await contracts['Lottery.sol']['Lottery']

  const result = await new web3.eth
    .Contract(contract.abi)
    .deploy({
      data: contract.evm.bytecode.object.toString(),
    })
    .send({
      from: accounts[0],
      gas: 1000000
    })

    console.log(contract.abi)
    console.log('Contract deployed to', result.options.address)
    console.log('Manager Address: ', accounts[0])
  provider.engine.stop();
}
init()
