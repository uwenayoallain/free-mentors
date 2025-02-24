import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
    it('should render without errors', () => {
        render(<App />);
        expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should render a heading with text "My App"', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: /my app/i })).toBeInTheDocument();
    });

    it('should render a paragraph with text "It\'s working!"', () => {
        render(<App />);
        expect(screen.getByText("It's working!")).toBeInTheDocument();
    });
});
