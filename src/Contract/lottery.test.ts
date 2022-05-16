import lottery, { CONTRACT_ADDRESS } from './lottery'
import LotteryContract from "./lottery"

// NOTE: This package required me to manually install (ethers) for it to work
// @ts-ignore
import { mock, resetMocks, confirm } from '@depay/web3-mock'
import CONTRACT_ABI from "./CONTRACT_ABI";

const MANAGER_ADDRESS = '0x5Af489c8786A018EC4814194dC8048be1007e390'

describe('lottery', () => {
    const blockchain = 'ethereum'

    beforeEach(resetMocks)

    test('should get the managers address', async () => {
        mock({
            blockchain,
            call: {
                to: CONTRACT_ADDRESS,
                api: CONTRACT_ABI,
                method: 'manager',
                return: MANAGER_ADDRESS
            }
        })

        const contract = new LotteryContract(window.ethereum)
        const manager = await contract.getManager()
        expect(manager).toEqual(MANAGER_ADDRESS)
    })

    test('should get a list of player', async () => {
        const LIST_OF_PLAYERS = [MANAGER_ADDRESS]
        mock({
            blockchain,
            call: {
                to: CONTRACT_ADDRESS,
                api: CONTRACT_ABI,
                method: 'getPlayers',
                return: LIST_OF_PLAYERS
            }
        })

        const contract = new LotteryContract(window.ethereum)
        const players = await contract.getPlayers()
        expect(players).toEqual(LIST_OF_PLAYERS)
    })

    test('should get the contract balance', async () => {
        const address = '0x4882aaf6e8961d5a7d8f9cd01d4ac86a9a1b1d4f'
        const BALANCE = '0'
        mock({
            blockchain,
            balance: {
                for: address,
                return: BALANCE
            }
        })

        const contract = new LotteryContract(window.ethereum)
        const balance = await contract.getBalance(address)
        expect(balance).toEqual(BALANCE)
    })

    test('should return the selected metamask address', async () => {
        const ADDRESSES = ['0x4882aaF6E8961D5A7D8f9Cd01D4AC86A9a1b1D4f']
        mock({
            blockchain,
            accounts: {
                return: ADDRESSES
            }
        })

        const contract = new LotteryContract(window.ethereum)
        const addresses = await contract.getAddress()
        expect(addresses).toEqual(ADDRESSES[0])
    })

    test.skip('should enter a lottery entry', async () => {

        // TODO: test broken and require more time to fix.
        // https://www.npmjs.com/package/@depay/web3-mock

        const ADDRESSES = ['0x4882aaF6E8961D5A7D8f9Cd01D4AC86A9a1b1D4f']
        let mockedTransaction = mock({
            blockchain,
            transaction: {
                method: 'entry',
                api: ['ERC20'],
                from: ADDRESSES[0],
                value: "1000000000000000000"
            }
        })

        // confirm(mockedTransaction)

        const contract = new LotteryContract(window.ethereum)

        // const addresses = await contract.enter(ADDRESSES[0])


        // expect(addresses).toEqual(ADDRESSES)
    })

    // TODO:
    test.skip('should pick a winner', async () => {})
})
