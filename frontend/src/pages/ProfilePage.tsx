import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Layout from "@/components/common/Layout";
import { UserRole } from "@/api/types";

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <Layout>
        <Typography>Loading profile...</Typography>
      </Layout>
    );
  }

  const isMentor = user.role === UserRole.MENTOR;

  return (
    <Layout>
      <Grid container spacing={ 4 }>
        <Grid item xs={ 12 } md={ 4 }>
          <Paper sx={ { p: 3 } }>
            <Box
              sx={ {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              } }
            >
              <Avatar
                src={
                  user.profilePicture ||
                  `https://i.pravatar.cc/300?u=${user.id}`
                }
                alt={ `${user.firstName} ${user.lastName}` }
                sx={ { width: 120, height: 120, mb: 2 } }
              />
              <Typography variant="h5" gutterBottom>
                { user.firstName } { user.lastName }
              </Typography>
              <Chip
                label={ user.role }
                color={ user.role === UserRole.MENTOR ? "primary" : "default" }
              />
            </Box>

            <Divider sx={ { my: 2 } } />

            <Typography variant="subtitle1" gutterBottom>
              Account Information
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Email:</strong> { user.email }
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Member Since:</strong>{ " " }
              { new Date(user.createdAt).toLocaleDateString() }
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={ 12 } md={ 8 }>
          <Paper sx={ { p: 3, mb: 3 } }>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>

            <Box component="form" noValidate>
              <Grid container spacing={ 2 }>
                <Grid item xs={ 12 } sm={ 6 }>
                  <TextField
                    fullWidth
                    label="First Name"
                    defaultValue={ user.firstName }
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={ 12 } sm={ 6 }>
                  <TextField
                    fullWidth
                    label="Last Name"
                    defaultValue={ user.lastName }
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={ 12 }>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={ user.email }
                    margin="normal"
                    disabled
                  />
                </Grid>
                <Grid item xs={ 12 }>
                  <TextField
                    fullWidth
                    label="Bio"
                    defaultValue={ user.bio || "" }
                    margin="normal"
                    multiline
                    minRows={ 4 }
                    placeholder="Tell us about yourself..."
                  />
                </Grid>
              </Grid>

              <Box sx={ { mt: 3, display: "flex", justifyContent: "flex-end" } }>
                <Button variant="contained" color="primary">
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Paper>

          { isMentor && (
            <Paper sx={ { p: 3 } }>
              <Typography variant="h6" gutterBottom>
                Mentor Settings
              </Typography>

              <Box component="form" noValidate>
                <TextField
                  fullWidth
                  label="Areas of Expertise"
                  defaultValue=""
                  margin="normal"
                  placeholder="e.g., Web Development, Data Science, Career Coaching"
                  helperText="Enter comma-separated expertise areas"
                />

                <TextField
                  fullWidth
                  label="Years of Experience"
                  type="number"
                  defaultValue="0"
                  margin="normal"
                />

                <Box
                  sx={ { mt: 3, display: "flex", justifyContent: "flex-end" } }
                >
                  <Button variant="contained" color="primary">
                    Update Mentor Profile
                  </Button>
                </Box>
              </Box>
            </Paper>
          ) }
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProfilePage;
