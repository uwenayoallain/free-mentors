import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Layout from "@/components/common/Layout";
import { UserType } from "@/api/types";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "@/store/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  expertise: z.string().optional(),
  occupation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      expertise: user?.expertise || "",
      occupation: user?.occupation || "",
    },
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated === false && !isLoading && !user) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (!user && !isLoading) {
    navigate("/auth/login");
    return null;
  }
  if (isLoading) {
    return (
      <Layout>
        <Box sx={ { display: "flex", justifyContent: "center", mt: 4 } }>
          <CircularProgress size={ 24 } />
        </Box>
      </Layout>
    );
  }

  const onSubmit = (data: ProfileFormValues) => {
    dispatch(updateProfile(data));
  };

  return (
    <Layout>
      <Stack spacing={ 4 }>
        <Paper sx={ { p: 3 } }>
          { user && (

            <Box sx={ { display: "flex", flexDirection: "column", alignItems: "center", mb: 4 } }>
              <Avatar
                src={ user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random` }
                alt={ `${user.firstName} ${user.lastName}` }
                sx={ { width: 120, height: 120, mb: 2 } }
              />
              <Typography variant="h5" gutterBottom>
                { user.firstName } { user.lastName }
              </Typography>
              <Chip
                label={ user.userType }
                color={ user.userType === UserType.MENTOR ? "primary" : "default" }
              />
            </Box>
          ) }
        </Paper>

        <Paper sx={ { p: 3, mb: 3 } }>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>

          <Box component="form" onSubmit={ handleSubmit(onSubmit) } noValidate>
            <Stack spacing={ 2 }>
              <TextField
                fullWidth
                label="First Name"
                { ...register("firstName") }
                error={ !!errors.firstName }
                helperText={ errors.firstName?.message }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Last Name"
                { ...register("lastName") }
                error={ !!errors.lastName }
                helperText={ errors.lastName?.message }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Bio"
                { ...register("bio") }
                margin="normal"
                multiline
                minRows={ 4 }
                placeholder="Tell us about yourself..."
              />
              <TextField
                fullWidth
                label="Areas of Expertise"
                { ...register("expertise") }
                margin="normal"
                placeholder="Web Development, Data Science, Career Coaching"
              />
              <TextField
                fullWidth
                label="Occupation"
                { ...register("occupation") }
                margin="normal"
              />
            </Stack>

            <Box sx={ { mt: 3, display: "flex", justifyContent: "flex-end" } }>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Layout>
  );
};

export default ProfilePage;
