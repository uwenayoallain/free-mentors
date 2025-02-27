import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Link,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { signup } from "../../store/authSlice";
import { Link as RouterLink } from "react-router-dom";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const { ...signupData } = data;
      await dispatch(signup(signupData)).unwrap();
    } catch (error: unknown) {
      const apiError = error as { errors?: Record<string, string | string[]> };
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          setError(field as keyof SignupFormValues, {
            type: "manual",
            message: Array.isArray(messages)
              ? messages[0]
              : (messages as string),
          });
        });
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        width: "100%",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create an Account
      </Typography>

      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ mb: 3 }}
      >
        Join Free Mentors to connect with experienced professionals
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoComplete="given-name"
              autoFocus
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              autoComplete="family-name"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Stack>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </Stack>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
        </Button>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link component={RouterLink} to="/auth/login" variant="body2">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default SignupForm;
