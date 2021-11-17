import assert from 'assert'
import Web3 from 'web3'


import contracts from '../compile.js'

let accounts
let contract
let lottery
let web3

before(async () => {
  try {
    web3 = new Web3('ws://localhost:7545');
    accounts = await web3.eth.getAccounts()
    contract = await contracts['Lottery.sol']['Lottery']

    // Deploy contract to ganache server
    lottery = await new web3.eth
      .Contract(contract.abi)
      .deploy({
        data: contract.evm.bytecode.object.toString(),
      })
      .send({
        from: accounts[0],
        gas: 1000000
      })
      .on('error', (e) => {
        console.log('error', e)
      })

  } catch (e) {
    console.log('***********************')
    console.log('***********************')
    console.log('Please run Ganache app!')
    console.log('***********************')
    console.log('***********************')
    console.log(e)
  }
})

async function enterPlayer(index, amount) {
  await lottery.methods.enter().send({
    from: accounts[index],
    value: web3.utils.toWei(amount, 'ether')
  })
}

describe('Lottery', () => {
  it('deploys a contract',  () => {
    assert.ok(lottery.options.address)
  })

  it('allows multiple accounts to enter', async () => {
    await enterPlayer(0, '0.02')
    await enterPlayer(1, '0.02')
    await enterPlayer(2, '0.02')

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })
    assert.equal(accounts[0], players[0])
    assert.equal(accounts[1], players[1])
    assert.equal(accounts[2], players[2])
    assert.equal(3, players.length)
  })

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await enterPlayer(0, '0.001')
      assert(false)
    } catch(e) {
      assert(e)
    }

  })

  // TODO: rework test to test error and success
  it('only manager can call pickWinner', async () => {

    const data = await lottery.methods.pickWinner().send({
      from: accounts[0],
    })

    assert(data.status == true, 'Only manager account can pick a winner')
  })

  it('sends money to the winner and resets the players array', async () => {
    await enterPlayer(0, '2')

    const initialBalance = await web3.eth.getBalance(accounts[0])

    const data = await lottery.methods.pickWinner().send({
      from: accounts[0],
    })

    const finalBalance = await web3.eth.getBalance(accounts[0])

    const difference = finalBalance - initialBalance

    assert(difference > web3.utils.toWei('1.8', 'ether'))
  })
})
