import assert from 'assert'
import deploy from '../deploy.js'

let accounts
let lottery
let web3

async function enterPlayer(index, amount) {
  return lottery.methods.enter().send({
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
      console.log('**********************************************')
      console.log('**********************************************')
      console.log('')
      console.log('Please run Ganache app!')
      console.log('')
      console.log('**********************************************')
      console.log('**********************************************')
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

  describe('Requires a minimum of 0.01 ether to enter',() => {
    it('should fail if the amount is less', async () => {
      try {
        await enterPlayer(0, '0.001')
      } catch (e) {
        assert.equal(e.data.name, 'RuntimeError')
      }
    })

    it('should add a player if the amount is more', async () => {
      const player = await enterPlayer(0, '0.1')
      assert.equal(player.status, true)
    })
  })

  describe('Only a manager can call pick winner function', () => {

    before(async () => {
      // To test pick winner properly it is required to remove all players from the
      // lottery using the pickWinner function. Maybe a reset function should be implemented.
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      })
    })

    it('fails if it is not the manager', async () => {
      try {
        await lottery.methods.pickWinner().send({
          from: accounts[1],
        })
      } catch (e) {
        assert.equal(e.data.name, 'RuntimeError')
      }
    })

    it('sends money to the winner and resets the players array', async () => {
      await enterPlayer(0, '2')
      const initialBalance = await web3.eth.getBalance(accounts[0])
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      })

      const finalBalance = await web3.eth.getBalance(accounts[0])
      const difference = finalBalance - initialBalance

      assert(difference > web3.utils.toWei('1.8', 'ether'))
    })
  })
})
