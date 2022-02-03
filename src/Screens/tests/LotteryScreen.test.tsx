import { render, screen } from '@testing-library/react'
import LotteryScreen from '../LotteryScreen'

describe('Lottery Screen', () => {
    test('renders lottery screen', () => {
        render(<LotteryScreen lotteryContract={undefined} blockchain="ethereum" />)
        const element = screen.getByText('Blockchain Lottery');
        expect(element).toBeInTheDocument();
    });
})
