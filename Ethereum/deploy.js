import HDWalletProvider from '@truffle/hdwallet-provider'
import Web3 from 'web3'

import contracts from './compile.js'

const privateKey = '102a9118cbdce304f18d1eabcfb265176e21748e9026fc840cafe9ffe5de727e'
const url = 'https://rinkeby.infura.io/v3/1db4c581e01e4e73baf328558f9ffe78'

const init = async function() {
  const provider = await new HDWalletProvider(privateKey, url)
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
await init()
