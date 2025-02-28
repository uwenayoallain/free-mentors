import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Paper,
  Chip,
  Divider,
  Button,
  Rating,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  WorkOutline as WorkIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Mentor, Review, UserRole } from "@/api/types";
import RequestSessionForm from "@/components/sessions/RequestSessionForm";

interface MentorDetailProps {
  mentor: Mentor;
  reviews: Review[];
}

const MentorDetail: React.FC<MentorDetailProps> = ({ mentor, reviews }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [dialogOpen, setDialogOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box>
      <Grid container spacing={ 4 }>
        <Grid item xs={ 12 } md={ 4 }>
          <Box sx={ { position: "sticky", top: 24 } }>
            <Paper sx={ { p: 3, mb: 3 } }>
              <Box
                sx={ {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                } }
              >
                <Avatar
                  src={
                    mentor.profilePicture ||
                    `https://i.pravatar.cc/300?u=${mentor.id}`
                  }
                  alt={ `${mentor.firstName} ${mentor.lastName}` }
                  sx={ { width: 120, height: 120, mb: 2 } }
                />
                <Typography variant="h5" gutterBottom>
                  { mentor.firstName } { mentor.lastName }
                </Typography>
                <Box sx={ { display: "flex", alignItems: "center", mb: 1 } }>
                  <Rating
                    value={ mentor.rating }
                    precision={ 0.5 }
                    readOnly
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={ { ml: 1 } }
                  >
                    ({ mentor.totalReviews } reviews)
                  </Typography>
                </Box>
              </Box>

              <Divider sx={ { my: 2 } } />

              <Box sx={ { mb: 2 } }>
                <Typography variant="subtitle1" sx={ { mb: 1, fontWeight: 500 } }>
                  Area of Expertise
                </Typography>
                <Box sx={ { display: "flex", flexWrap: "wrap", gap: 1 } }>
                  { mentor.expertise.map((skill, index) => (
                    <Chip
                      key={ index }
                      label={ skill }
                      size="small"
                      color="primary"
                    />
                  )) }
                </Box>
              </Box>

              <Box sx={ { mb: 2 } }>
                <Typography
                  variant="subtitle1"
                  sx={ {
                    mb: 1,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  } }
                >
                  <WorkIcon fontSize="small" sx={ { mr: 1 } } />
                  Experience
                </Typography>
                <Typography variant="body2">
                  { mentor.yearsOfExperience }{ " " }
                  { mentor.yearsOfExperience === 1 ? "year" : "years" } of
                  experience
                </Typography>
              </Box>

              <Box sx={ { mb: 2 } }>
                <Typography
                  variant="subtitle1"
                  sx={ {
                    mb: 1,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                  } }
                >
                  <TimeIcon fontSize="small" sx={ { mr: 1 } } />
                  Available Days
                </Typography>
                <Typography variant="body2">
                  { mentor.availableDays.join(", ") }
                </Typography>
              </Box>

              { isAuthenticated && user?.role !== UserRole.MENTOR && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={ <EventIcon /> }
                  onClick={ handleOpenDialog }
                  sx={ { mt: 2 } }
                >
                  Request Session
                </Button>
              ) }
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={ 12 } md={ 8 }>
          <Paper sx={ { p: 3, mb: 3 } }>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body1" paragraph>
              { mentor.bio || "No bio provided." }
            </Typography>
          </Paper>

          <Paper sx={ { p: 3 } }>
            <Box
              sx={ {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              } }
            >
              <Typography variant="h6">Reviews ({ reviews.length })</Typography>
            </Box>

            { reviews.length === 0 ? (
              <Box sx={ { py: 2, textAlign: "center" } }>
                <Typography variant="body1" color="text.secondary">
                  No reviews yet.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={ 2 }>
                { reviews.map((review) => (
                  <Grid item xs={ 12 } key={ review.id }>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={ { display: "flex", alignItems: "center", mb: 1 } }
                        >
                          <PersonIcon
                            fontSize="small"
                            sx={ { mr: 1, color: "text.secondary" } }
                          />
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Anonymous Mentee
                          </Typography>
                        </Box>
                        <Box
                          sx={ { display: "flex", alignItems: "center", mb: 2 } }
                        >
                          <Rating
                            value={ review.rating }
                            precision={ 0.5 }
                            readOnly
                            size="small"
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={ { ml: 1 } }
                          >
                            { new Date(review.createdAt).toLocaleDateString() }
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          { review.comment }
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )) }
              </Grid>
            ) }
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={ dialogOpen }
        onClose={ handleCloseDialog }
        fullWidth
        maxWidth="sm"
        fullScreen={ isMobile }
      >
        <DialogTitle>Request a Mentorship Session</DialogTitle>
        <DialogContent dividers>
          <RequestSessionForm
            mentorId={ mentor.id }
            onSuccess={ handleCloseDialog }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleCloseDialog }>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorDetail;
