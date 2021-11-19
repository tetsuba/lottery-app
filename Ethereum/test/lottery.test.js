import assert from 'assert'
import deploy from '../deploy.js'

let accounts
let lottery
let web3

async function enterPlayer(index, amount) {
  await lottery.methods.enter().send({
    from: accounts[index],
    value: web3.utils.toWei(amount, 'ether')
  })
}

describe('Lottery', () => {
  before(async () => {
    try {
      const data = await deploy()
      accounts = data.accounts
      lottery = data.lottery
      web3 = data.web3

    } catch (e) {
      console.log('***********************')
      console.log('***********************')
      console.log('Please run Ganache app!')
      console.log('***********************')
      console.log('***********************')
      console.log(e)
    }
  })


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
