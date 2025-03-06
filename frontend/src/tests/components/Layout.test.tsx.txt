import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import * as sessionsSlice from '@/store/sessionsSlice';
import * as usersSlice from '@/store/usersSlice';
import * as authSlice from '@/store/authSlice';
import Layout from '@/components/common/Layout';
import { configureStore } from '@reduxjs/toolkit';
import sessionsReducer from '@/store/sessionsSlice';
import usersReducer from '@/store/usersSlice';
import authReducer from '@/store/authSlice';
import { act } from 'react-dom/test-utils';

// Mock the navbar component
jest.mock('@/components/common/Navbar', () => () => <div data-testid="navbar">Navbar</div>);

describe('Layout Component', () => {
    let store: ReturnType<typeof createTestStore>;

    function createTestStore(preloadedState = {}) {
        return configureStore({
            reducer: {
                auth: authReducer,
                users: usersReducer,
                sessions: sessionsReducer,
            },
            preloadedState
        });
    }

    beforeEach(() => {
        store = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: null, successMessage: null },
        });

        // Mock dispatch actions
        jest.spyOn(sessionsSlice, 'clearSessionError').mockImplementation(() => ({ payload: undefined, type: 'sessions/clearSessionError' }));
        jest.spyOn(sessionsSlice, 'clearSuccessMessage').mockImplementation(() => ({ payload: undefined, type: 'sessions/clearSuccessMessage' }));
        jest.spyOn(usersSlice, 'clearError').mockImplementation(() => ({ payload: undefined, type: 'users/clearError' }));
        jest.spyOn(authSlice, 'clearErrors').mockImplementation(() => ({ payload: undefined, type: 'auth/clearErrors' }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render children correctly', () => {
        render(
            <Provider store={ store }>
                <Layout>
                    <div data-testid="child-element">Child Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByTestId('child-element')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should render the navbar', () => {
        render(
            <Provider store={ store }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should render the footer with current year', () => {
        render(
            <Provider store={ store }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(`Free Mentors © ${currentYear} - A social initiative for mentorship`)).toBeInTheDocument();
    });

    it('should display error message from auth state when present', () => {
        const errorStore = createTestStore({
            auth: { error: { message: 'Auth error message' } },
            users: { error: null },
            sessions: { error: null, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('Auth error message')).toBeInTheDocument();
    });

    it('should display error message from users state when present', () => {
        const errorStore = createTestStore({
            auth: { error: null },
            users: { error: { message: 'User error message' } },
            sessions: { error: null, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('User error message')).toBeInTheDocument();
    });

    it('should display error message from sessions state when present', () => {
        const errorStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: { message: 'Session error message' }, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('Session error message')).toBeInTheDocument();
    });

    it('should display success message when present', () => {
        const successStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: null, successMessage: 'Success message' },
        });

        render(
            <Provider store={ successStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('should dispatch clearErrors when closing auth error alert', () => {
        const errorStore = createTestStore({
            auth: { error: { message: 'Auth error message' } },
            users: { error: null },
            sessions: { error: null, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText(/close/i));

        expect(authSlice.clearErrors).toHaveBeenCalled();
    });

    it('should dispatch clearError when closing user error alert', () => {
        const errorStore = createTestStore({
            auth: { error: null },
            users: { error: { message: 'User error message' } },
            sessions: { error: null, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText(/close/i));

        expect(usersSlice.clearError).toHaveBeenCalled();
    });

    it('should dispatch clearSessionError when closing session error alert', () => {
        const errorStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: { message: 'Session error message' }, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText(/close/i));

        expect(sessionsSlice.clearSessionError).toHaveBeenCalled();
    });

    it('should dispatch clearSuccessMessage when closing success alert', () => {
        const successStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: null, successMessage: 'Success message' },
        });

        render(
            <Provider store={ successStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText(/close/i));

        expect(sessionsSlice.clearSuccessMessage).toHaveBeenCalled();
    });

    it('should apply custom maxWidth when provided', () => {
        render(
            <Provider store={ store }>
                <Layout maxWidth="sm">
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
    });

    // Additional tests
    it('should auto-hide error snackbar after duration', async () => {
        jest.useFakeTimers();

        const errorStore = createTestStore({
            auth: { error: { message: 'Auth error message' } },
            users: { error: null },
            sessions: { error: null, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        // Advance timers to trigger auto-hide
        act(() => {
            jest.advanceTimersByTime(6000);
        });

        await waitFor(() => {
            expect(authSlice.clearErrors).toHaveBeenCalled();
        });

        jest.useRealTimers();
    });

    it('should auto-hide success snackbar after duration', async () => {
        jest.useFakeTimers();

        const successStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: null, successMessage: 'Success message' },
        });

        render(
            <Provider store={ successStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        // Advance timers to trigger auto-hide
        act(() => {
            jest.advanceTimersByTime(6000);
        });

        await waitFor(() => {
            expect(sessionsSlice.clearSuccessMessage).toHaveBeenCalled();
        });

        jest.useRealTimers();
    });

    it('should properly handle falsy maxWidth prop', () => {
        render(
            <Provider store={ store }>
                <Layout maxWidth={ false }>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
    });

    it('should prioritize auth error over other errors', () => {
        const multipleErrorsStore = createTestStore({
            auth: { error: { message: 'Auth error message' } },
            users: { error: { message: 'User error message' } },
            sessions: { error: { message: 'Session error message' }, successMessage: null },
        });

        render(
            <Provider store={ multipleErrorsStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('Auth error message')).toBeInTheDocument();
        expect(screen.queryByText('User error message')).not.toBeInTheDocument();
        expect(screen.queryByText('Session error message')).not.toBeInTheDocument();
    });

    it('should prioritize user error over session error', () => {
        const multipleErrorsStore = createTestStore({
            auth: { error: null },
            users: { error: { message: 'User error message' } },
            sessions: { error: { message: 'Session error message' }, successMessage: null },
        });

        render(
            <Provider store={ multipleErrorsStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('User error message')).toBeInTheDocument();
        expect(screen.queryByText('Session error message')).not.toBeInTheDocument();
    });

    it('should show both error and success messages simultaneously when both are present', () => {
        const bothMessagesStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: { message: 'Session error message' }, successMessage: 'Success message' },
        });

        render(
            <Provider store={ bothMessagesStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('Session error message')).toBeInTheDocument();
        expect(screen.getByText('Success message')).toBeInTheDocument();
    });
});

// Mock the navbar component
jest.mock('@/components/common/Navbar', () => () => <div data-testid="navbar">Navbar</div>);

describe('Layout Component', () => {
    let store: ReturnType<typeof createTestStore>;

    function createTestStore(preloadedState = {}) {
        return configureStore({
            reducer: {
                auth: authReducer,
                users: usersReducer,
                sessions: sessionsReducer,
            },
            preloadedState
        });
    }

    beforeEach(() => {
        store = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: null, successMessage: null },
        });

        // Mock dispatch actions
        jest.spyOn(sessionsSlice, 'clearSessionError').mockImplementation(() => ({ payload: undefined, type: 'sessions/clearSessionError' }));
        jest.spyOn(sessionsSlice, 'clearSuccessMessage').mockImplementation(() => ({ payload: undefined, type: 'sessions/clearSuccessMessage' }));
        jest.spyOn(usersSlice, 'clearError').mockImplementation(() => ({ payload: undefined, type: 'users/clearError' }));
        jest.spyOn(authSlice, 'clearErrors').mockImplementation(() => ({ payload: undefined, type: 'auth/clearErrors' }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render children correctly', () => {
        render(
            <Provider store={ store }>
                <Layout>
                    <div data-testid="child-element">Child Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByTestId('child-element')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should render the navbar', () => {
        render(
            <Provider store={ store }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should render the footer with current year', () => {
        render(
            <Provider store={ store }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(`Free Mentors © ${currentYear} - A social initiative for mentorship`)).toBeInTheDocument();
    });

    it('should display error message from auth state when present', () => {
        const errorStore = createTestStore({
            auth: { error: { message: 'Auth error message' } },
            users: { error: null },
            sessions: { error: null, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('Auth error message')).toBeInTheDocument();
    });

    it('should display error message from users state when present', () => {
        const errorStore = createTestStore({
            auth: { error: null },
            users: { error: { message: 'User error message' } },
            sessions: { error: null, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('User error message')).toBeInTheDocument();
    });

    it('should display error message from sessions state when present', () => {
        const errorStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: { message: 'Session error message' }, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('Session error message')).toBeInTheDocument();
    });

    it('should display success message when present', () => {
        const successStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: null, successMessage: 'Success message' },
        });

        render(
            <Provider store={ successStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('should dispatch clearErrors when closing auth error alert', () => {
        const errorStore = createTestStore({
            auth: { error: { message: 'Auth error message' } },
            users: { error: null },
            sessions: { error: null, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText(/close/i));

        expect(authSlice.clearErrors).toHaveBeenCalled();
    });

    it('should dispatch clearError when closing user error alert', () => {
        const errorStore = createTestStore({
            auth: { error: null },
            users: { error: { message: 'User error message' } },
            sessions: { error: null, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText(/close/i));

        expect(usersSlice.clearError).toHaveBeenCalled();
    });

    it('should dispatch clearSessionError when closing session error alert', () => {
        const errorStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: { message: 'Session error message' }, successMessage: null },
        });

        render(
            <Provider store={ errorStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText(/close/i));

        expect(sessionsSlice.clearSessionError).toHaveBeenCalled();
    });

    it('should dispatch clearSuccessMessage when closing success alert', () => {
        const successStore = createTestStore({
            auth: { error: null },
            users: { error: null },
            sessions: { error: null, successMessage: 'Success message' },
        });

        render(
            <Provider store={ successStore }>
                <Layout>
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText(/close/i));

        expect(sessionsSlice.clearSuccessMessage).toHaveBeenCalled();
    });

    it('should apply custom maxWidth when provided', () => {
        render(
            <Provider store={ store }>
                <Layout maxWidth="sm">
                    <div>Content</div>
                </Layout>
            </Provider>
        );

        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
    });
});