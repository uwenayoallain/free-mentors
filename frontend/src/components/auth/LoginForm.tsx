import React from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Link
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { login } from '@/store/authSlice';
import { Link as RouterLink } from 'react-router-dom';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await dispatch(login(data)).unwrap();
        } catch (error: unknown) {
            const apiError = error as { errors?: Record<string, string | string[]> };
            if (apiError.errors) {
                Object.entries(apiError.errors).forEach(([field, messages]) => {
                    setError(field as keyof LoginFormValues, {
                        type: 'manual',
                        message: Array.isArray(messages) ? messages[0] : messages as string,
                    });
                });
            }
        }
    };

    return (
        <Paper
            elevation={ 3 }
            sx={ {
                p: 4,
                width: '100%',
                maxWidth: 500,
                mx: 'auto',
            } }>
            <Typography variant="h5" component="h1" gutterBottom align="center">
                Welcome Back
            </Typography>

            <Typography variant="body2" color="textSecondary" align="center" sx={ { mb: 3 } }>
                Sign in to continue to Free Mentors
            </Typography>

            <Box component="form" onSubmit={ handleSubmit(onSubmit) } noValidate>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    { ...register('email') }
                    error={ !!errors.email }
                    helperText={ errors.email?.message }
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    { ...register('password') }
                    error={ !!errors.password }
                    helperText={ errors.password?.message }
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={ isLoading }
                    sx={ { mt: 3, mb: 2 } }
                >
                    { isLoading ? <CircularProgress size={ 24 } /> : 'Sign In' }
                </Button>

                <Box sx={ { textAlign: 'center', mt: 2 } }>
                    <Typography variant="body2">
                        Don't have an account?{ ' ' }
                        <Link component={ RouterLink } to="/auth/signup" variant="body2">
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}

export default LoginForm;