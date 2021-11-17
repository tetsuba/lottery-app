import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "enter",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pickWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getPlayers",
    "outputs": [
      {
        "internalType": "address payable[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "manager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "players",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const CONTRACT_ADDRESS = '0x4882aaF6E8961D5A7D8f9Cd01D4AC86A9a1b1D4f'

async function LotteryContract() {
  const provider = await detectEthereumProvider();
  if (provider) {
    const web3 = new Web3(window.ethereum)
    return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
  } else {
    return null
  }
}

export default LotteryContract