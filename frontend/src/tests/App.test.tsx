import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
    it('should render a button with text "Click Me"', () => {
        render(<App />);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should render text "Hello, Free mentors"', () => {
        render(<App />);
        expect(screen.getByText(/hello, free mentors/i)).toBeInTheDocument();
    });

    it('should render inside a container', () => {
        const { container } = render(<App />);
        expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument();
    });
});
