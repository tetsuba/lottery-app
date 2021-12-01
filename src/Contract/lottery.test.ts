import lottery, { CONTRACT_ADDRESS } from './lottery'
import LotteryContract from "./lottery"

// NOTE: This package required me to manually install (ethers) for it to work
// @ts-ignore
import { mock, resetMocks } from '@depay/web3-mock'
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
        const BALANCE = '0'
        mock({
            blockchain,
            balance: {
                for: "0x4882aaf6e8961d5a7d8f9cd01d4ac86a9a1b1d4f",
                return: BALANCE
            }
        })

        const contract = new LotteryContract(window.ethereum)
        const balance = await contract.getBalance()
        expect(balance).toEqual(BALANCE)
    })
})
