import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LotteryScreen from '../LotteryScreen'
import LotteryContract from '../../Contract/lottery'
import detectEthereumProvider from "@metamask/detect-provider"

jest.mock('../../Contract/lottery')
jest.mock('@metamask/detect-provider', () => {
    const target = {
        isMetaMask: true
    };
    const handler1 = {};
    const proxy1 = new Proxy(target, handler1);

    return () => {
        return Promise.resolve(proxy1)
    }
})

const MOCK = {
    PLAYERS: ['Player 1'],
    ADD_PLAYER: ['Player 1', 'Player 2'],
    MANAGER_ADDRESS: 'MANAGER_MOCK_ADDRESS',
    NETWORK: 'Rinkeby',
    BALANCE: '2',
    PLAYERS_BALANCE: '12',
    SELECTED_ADDRESS: 'MOCK_WALLET_ADDRESS'
}

describe('Lottery Screen', () => {
    let provider: any

    beforeEach(async () => {
        provider = await detectEthereumProvider()
        LotteryContract.prototype.getManager = jest.fn().mockResolvedValueOnce(MOCK.MANAGER_ADDRESS)
        LotteryContract.prototype.getPlayers = jest.fn().mockResolvedValueOnce([])
    })

    describe('Renders', () => {

        describe('Metamask wallet installed', () => {
            test('false', async () => {
                provider.isMetaMask = false
                render(<LotteryScreen />)
                const metamaskMessage = await screen.findByText(/Metamask wallet required./)
                expect(metamaskMessage).toBeInTheDocument()
            })
            test('true', async () => {
                provider.isMetaMask = true
                render(<LotteryScreen />)
                const metamaskMessage = await screen.findByText('Metamask wallet installed')
                expect(metamaskMessage).toBeInTheDocument()
            })
        })

        describe('Required network', () => {

            test('other', async () => {
                LotteryContract.prototype.getNetworkFromWallet = jest.fn().mockResolvedValueOnce('other')
                render(<LotteryScreen />)
                const metamaskMessage = await screen.findByText('Please switch network to Rinkeby')
                expect(metamaskMessage).toBeInTheDocument()
            })

            test('Rinkeby', async () => {
                LotteryContract.prototype.getNetworkFromWallet = jest.fn().mockResolvedValueOnce(MOCK.NETWORK)
                render(<LotteryScreen />)
                const metamaskMessage = await screen.findByText('Rinkeby Network')
                expect(metamaskMessage).toBeInTheDocument()
            })
        })

        describe('Wallet unlocked', () => {
            test('Locked', async () => {
                LotteryContract.prototype.getAddress = () => Promise.resolve('')
                render(<LotteryScreen />)
                const metamaskMessage = await screen.findByText('Please unlock your wallet')
                expect(metamaskMessage).toBeInTheDocument()
            })

            test('Unlocked', async () => {
                LotteryContract.prototype.getAddress = () => Promise.resolve('Ox123')
                render(<LotteryScreen />)
                const metamaskMessage = await screen.findByText('Wallet Unlocked')
                expect(metamaskMessage).toBeInTheDocument()
            })
        })

        describe('1 ETH Required to play', () => {
            test('false', async () => {
                LotteryContract.prototype.getBalance = () => Promise.resolve('0.5')
                render(<LotteryScreen />)
                const text = await screen.findByText('1 ETH required to play')
                expect(text).toBeInTheDocument()
            })

            test('true', async () => {
                LotteryContract.prototype.getBalance = () => Promise.resolve(MOCK.BALANCE)
                render(<LotteryScreen />)
                const text = await screen.findByText('1 ETH')
                expect(text).toBeInTheDocument()
            })
        })

        describe('All requirements met', () => {

            beforeEach(async () => {
                LotteryContract.prototype.getNetworkFromWallet = jest.fn()
                    .mockResolvedValue(MOCK.NETWORK)
            })

            test.skip('false', async () => {
                LotteryContract.prototype.getBalance = () => Promise.resolve('0.5')
                render(<LotteryScreen />)
                const text = await screen.findByText('Click here to enter lottery!')
                expect(text).not.toBeInTheDocument()
            })

            test('true', async () => {
                LotteryContract.prototype.getBalance = () => Promise.resolve(MOCK.BALANCE)
                render(<LotteryScreen />)
                const text = await screen.findByText('Click here to enter lottery!')
                expect(text).toBeInTheDocument()
            })
        })
    })

    describe('Event', () => {
        beforeEach(() => {
            LotteryContract.prototype.getNetworkFromWallet = jest.fn().mockResolvedValue(MOCK.NETWORK)

            LotteryContract.prototype.getPlayers = jest.fn()
                .mockResolvedValueOnce(MOCK.PLAYERS)
                .mockResolvedValueOnce(MOCK.ADD_PLAYER)

            LotteryContract.prototype.getBalance = jest.fn()
                .mockResolvedValueOnce('2')
                .mockResolvedValueOnce('2')
                .mockResolvedValueOnce('4')

            render(<LotteryScreen />)
        })

        describe('Click', () => {
            describe('Enter Lottery', () => {
                test('Updates the number of players and the competing amount', async () => {
                    await waitFor(() => {
                        expect(screen.getAllByTestId('players')).toHaveLength(1)
                        expect(screen.getByText('Competing to win 2 ETH')).toBeInTheDocument()
                    })
                    fireEvent.click(screen.getByText('Click here to enter lottery!'))
                    await waitFor(() => {
                        expect(screen.getAllByTestId('players')).toHaveLength(2)
                        expect(screen.getByText('Competing to win 4 ETH')).toBeInTheDocument()
                    })
                })
            })
        })
    })
})
