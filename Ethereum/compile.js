import path from 'path'
import fs from 'fs'
import solc from 'solc'

// TODO: implement and code tidy up should this be an enum?
const CONTRACTS = {
  LOTTERY: {  NAME: '', FILE_NAME: 'Lottery.sol' }
}

const contractPath = path.resolve('contracts', 'Lottery.sol')
const source = fs.readFileSync(contractPath, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: source,
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};




const output = JSON.parse(solc.compile(JSON.stringify(input)));



// // `output` here contains the JSON output as specified in the documentation
// for (let contractName in output.contracts['inbox.sol']) {
//   console.log(
//     contractName +
//     ': ' +
//     output.contracts['inbox.sol'][contractName].evm.bytecode.object
//   );
// }



export default output.contracts
