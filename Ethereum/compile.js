import path from 'path'
import fs from 'fs'
import solc from 'solc'

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

export const lotteryContract = output.contracts['Lottery.sol']['Lottery']