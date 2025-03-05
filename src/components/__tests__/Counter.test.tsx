import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from '../Counter';

describe('Counter Component', () => {
    test('renders without crashing', () => {
        render(<Counter />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('initial count value is 0', () => {
        render(<Counter />);
        const countDisplay = screen.getByText('0');
        expect(countDisplay).toBeInTheDocument();
    });

    test('clicking increment button increases count by 1', () => {
        render(<Counter />);
        const incrementButton = screen.getByText('+');
        const countDisplay = screen.getByText('0');

        fireEvent.click(incrementButton);
        expect(countDisplay).toHaveTextContent('1');
    });

    test('clicking decrement button decreases count by 1', () => {
        render(<Counter />);
        const decrementButton = screen.getByText('-');
        const countDisplay = screen.getByText('0');

        fireEvent.click(decrementButton);
        expect(countDisplay).toHaveTextContent('-1');
    });
}); 