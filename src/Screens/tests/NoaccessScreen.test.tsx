import { render, screen } from '@testing-library/react'
import NoAccessScreen from "../NoAccessScreen";

describe('Lottery Screen', () => {
    test('renders lottery screen', () => {
        render(<NoAccessScreen />)
        const element = screen.getByText('You need a metamask wallet and ethereum to play!');
        expect(element).toBeInTheDocument();
    });
})
