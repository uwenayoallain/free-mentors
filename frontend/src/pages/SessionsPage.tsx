import React, { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchSessions } from "@/store/sessionsSlice";
import Layout from "@/components/common/Layout";
import SessionsList from "@/components/sessions/SessionsList";
import { UserRole } from "@/api/types";
import { fetchMentors, selectMentors, fetchUsers, selectAllUsers } from "@/store/usersSlice";

const SessionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, isLoading } = useSelector(
    (state: RootState) => state.sessions,
  );
  const mentors = useSelector(selectMentors);
  const users = useSelector(selectAllUsers);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchSessions());
    dispatch(fetchMentors());
    dispatch(fetchUsers());
  }, [dispatch]);

  const roleText =
    user?.role === UserRole.MENTOR
      ? "As a mentor, you can manage mentorship requests and help guide others on their journey."
      : "Track your mentorship sessions, from requests to completed sessions.";

  return (
    <Layout>
      <Paper
        sx={ {
          p: 4,
          mb: 4,
          background: "linear-gradient(to right, #1976d2, #64b5f6)",
        } }
      >
        <Box sx={ { color: "white", maxWidth: 800 } }>
          <Typography variant="h4" gutterBottom>
            My Sessions
          </Typography>
          <Typography variant="body1">{ roleText }</Typography>
        </Box>
      </Paper>

      <SessionsList
        sessions={ sessions }
        isLoading={ isLoading }
        mentors={ mentors }
        users={ users }
      />
    </Layout>
  );
};

export default SessionsPage;