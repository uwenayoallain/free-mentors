import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tabs,
  Tab,
  Stack,
  TextField,
  InputAdornment,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchSessions, selectSessions } from "@/store/sessionsSlice";
import Layout from "@/components/common/Layout";
import Loading from "@/components/common/Loading";
import { UserType, User, Review, SessionStatus } from "@/api/types";
import {
  changeMentorStatus,
  hideReview,
  fetchAllUsers,
  selectAllUsers,
  fetchAllReviews,
  selectAllReviews,
} from "@/store/usersSlice";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const reviews = useSelector(selectAllReviews);
  const isLoading = useSelector((state: RootState) => state.users.isLoading);
  const usersList = useSelector(selectAllUsers);

  const sessions = useSelector(selectSessions);
  const { user } = useSelector((state: RootState) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<"promote" | "demote" | null>(null);

  // New state for hide review confirmation dialog
  const [hideReviewDialogOpen, setHideReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // New state for toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info" as "error" | "info" | "success" | "warning",
  });

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchSessions());
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleOpenDialog = (user: User, actionType: "promote" | "demote") => {
    setSelectedUser(user);
    setAction(actionType);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setAction(null);
  };

  // New handlers for hide review dialog
  const handleOpenHideReviewDialog = (review: Review) => {
    setSelectedReview(review);
    setHideReviewDialogOpen(true);
  };

  const handleCloseHideReviewDialog = () => {
    setHideReviewDialogOpen(false);
    setSelectedReview(null);
  };

  // Toast handlers
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const showToast = (message: string, severity: "error" | "info" | "success" | "warning") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleChangeMentorStatus = async () => {
    if (selectedUser && action) {
      try {
        await dispatch(
          changeMentorStatus({
            userId: selectedUser.id,
            makeMentor: action === "promote",
          })
        ).unwrap();
        handleCloseDialog();
        showToast(
          `${selectedUser.firstName} ${selectedUser.lastName} has been ${action === "promote" ? "promoted to mentor" : "demoted from mentor"
          }`,
          "success"
        );
      } catch (error) {
        console.error("Failed to change mentor status", error);
        showToast("Failed to change mentor status", "error");
      }
    }
  };

  const handleHideReview = async () => {
    if (selectedReview) {
      try {
        await dispatch(hideReview(selectedReview.id)).unwrap();
        handleCloseHideReviewDialog();
        showToast("Review has been hidden successfully", "success");
      } catch (error) {
        console.error("Failed to hide review", error);
        showToast("Failed to hide review", "error");
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = usersList.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );

  const allReviews: Review[] = reviews;
  const navigate = useNavigate();

  if (!user || user.userType !== UserType.ADMIN) {
    navigate("/");
  }

  if (isLoading && !usersList.length) {
    return (
      <Layout>
        <Loading message="Loading admin dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Paper
        sx={ {
          p: 4,
          mb: 4,
          background: "linear-gradient(90deg, rgba(79,70,229,1) 0%, rgba(79,70,229,1) 35%, rgba(79,70,249,1) 100%)",
        } }
      >
        <Box sx={ { color: "white" } }>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1">
            Manage users, monitor mentorship sessions, and control platform
            content.
          </Typography>
        </Box>
      </Paper>

      <Box sx={ { mb: 4 } }>
        <Tabs
          value={ tabValue }
          onChange={ handleTabChange }
          sx={ { borderBottom: 1, borderColor: "divider" } }
        >
          <Tab label="User Management" id="tab-0" />
          <Tab label="Session Overview" id="tab-1" />
          <Tab label="Reviews Moderation" id="tab-2" />
        </Tabs>
      </Box>

      {/* User Management Tab */ }
      <Box role="tabpanel" hidden={ tabValue !== 0 }>
        { tabValue === 0 && (
          <Box>
            <Stack
              direction={ { xs: "column", sm: "row" } }
              spacing={ 2 }
              alignItems={ { xs: "flex-start", sm: "center" } }
              justifyContent="space-between"
              sx={ { mb: 3 } }
            >
              <Typography variant="h6">Users</Typography>
              <TextField
                placeholder="Search users..."
                size="small"
                sx={ { width: { xs: "100%", sm: 300 } } }
                onChange={ handleSearchChange }
                InputProps={ {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                } }
              />
            </Stack>

            <TableContainer component={ Paper }>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { filteredUsers.map((user) => (
                    <TableRow key={ user.id }>
                      <TableCell>{ `${user.firstName} ${user.lastName}` }</TableCell>
                      <TableCell>{ user.email }</TableCell>
                      <TableCell>
                        <Chip
                          label={ user.userType }
                          color={
                            user.userType === UserType.ADMIN
                              ? "error"
                              : user.userType === UserType.MENTOR
                                ? "primary"
                                : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        { user.userType == UserType.MENTEE && (
                          <Button
                            variant="outlined"
                            size="small"
                            color={ "primary" }
                            startIcon={
                              <PersonAddIcon />
                            }
                            onClick={ () =>
                              handleOpenDialog(
                                user,

                                "promote"
                              )
                            }
                          >
                            { user.userType === UserType.MENTEE && "Make Mentor" }
                          </Button>
                        ) }
                      </TableCell>
                    </TableRow>
                  )) }
                  { filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={ 5 } align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) }
      </Box>

      {/* Session Overview Tab */ }
      <Box role="tabpanel" hidden={ tabValue !== 1 }>
        { tabValue === 1 && (
          <Box>
            <Typography variant="h6" sx={ { mb: 3 } }>
              Sessions Overview
            </Typography>

            <TableContainer component={ Paper }>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Session Title</TableCell>
                    <TableCell>Mentor</TableCell>
                    <TableCell>Mentee</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { sessions.map((session) => {
                    return (
                      <TableRow key={ session.id }>
                        <TableCell>{ session.topic }</TableCell>
                        <TableCell>
                          { session.mentor.firstName } { session.mentor.lastName }
                        </TableCell>
                        <TableCell>
                          { session.mentee.firstName } { session.mentee.lastName }
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ session.status }
                            color={
                              session.status === SessionStatus.ACCEPTED
                                ? "success"
                                : session.status === SessionStatus.DECLINED
                                  ? "error"
                                  : session.status === SessionStatus.COMPLETED
                                    ? "info"
                                    : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  }) }
                  { sessions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={ 5 } align="center">
                        No sessions found
                      </TableCell>
                    </TableRow>
                  ) }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) }
      </Box>

      {/* Reviews Moderation Tab */ }
      <Box role="tabpanel" hidden={ tabValue !== 2 }>
        { tabValue === 2 && (
          <Box>
            <Typography variant="h6" sx={ { mb: 3 } }>
              Reviews Moderation
            </Typography>

            <TableContainer component={ Paper }>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mentor</TableCell>
                    <TableCell>Mentee</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Review</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { allReviews.map((review) => {
                    return (
                      <TableRow key={ review.id }>
                        <TableCell>
                          { review.session.mentor?.firstName } { review.session.mentor?.lastName }
                        </TableCell>
                        <TableCell>
                          { review.session.mentee.firstName } { review.session.mentee.lastName }
                        </TableCell>
                        <TableCell>
                          <Rating
                            value={ review.rating }
                            readOnly
                            size="small"
                            precision={ 0.5 }
                          />
                        </TableCell>
                        <TableCell
                          sx={ {
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          } }
                        >
                          { review.content }
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ review.isVisible ? "Visible" : "Hidden" }
                            color={ review.isVisible ? "success" : "error" }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          { review.isVisible && (
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={ () => handleOpenHideReviewDialog(review) }
                            >
                              Hide Review
                            </Button>
                          ) }
                        </TableCell>
                      </TableRow>
                    );
                  }) }
                  { allReviews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={ 6 } align="center">
                        No reviews found
                      </TableCell>
                    </TableRow>
                  ) }
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) }
      </Box>

      {/* Change Mentor Status Dialog */ }
      <Dialog open={ dialogOpen } onClose={ handleCloseDialog }>
        <DialogTitle>
          { action === "promote"
            ? "Promote User to Mentor"
            : "Remove Mentor Status" }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            { action === "promote"
              ? `Are you sure you want to make ${selectedUser?.firstName} ${selectedUser?.lastName} a mentor?`
              : `Are you sure you want to remove ${selectedUser?.firstName} ${selectedUser?.lastName}'s mentor status?` }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleCloseDialog }>Cancel</Button>
          <Button
            onClick={ handleChangeMentorStatus }
            color={ action === "promote" ? "primary" : "error" }
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hide Review Confirmation Dialog */ }
      <Dialog open={ hideReviewDialogOpen } onClose={ handleCloseHideReviewDialog }>
        <DialogTitle>Hide Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to hide this review?
            Hidden reviews will not be visible to users on the platform.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleCloseHideReviewDialog }>Cancel</Button>
          <Button
            onClick={ handleHideReview }
            color="error"
            variant="contained"
          >
            Hide Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */ }
      <Snackbar
        open={ toast.open }
        autoHideDuration={ 6000 }
        onClose={ handleCloseToast }
        anchorOrigin={ { vertical: 'top', horizontal: 'right' } }
      >
        <Alert
          onClose={ handleCloseToast }
          severity={ toast.severity }
          variant="filled"
          sx={ { width: '100%' } }
        >
          { toast.message }
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default AdminDashboard;