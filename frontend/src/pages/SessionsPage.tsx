import React, { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchSessions } from "@/store/sessionsSlice";
import Layout from "@/components/common/Layout";
import SessionsList from "@/components/sessions/SessionsList";
import { UserType } from "@/api/types";

const SessionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, isLoading } = useSelector(
    (state: RootState) => state.sessions,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const roleText =
    user?.userType === UserType.MENTOR
      ? "As a mentor, you can manage mentorship requests and help guide others on their journey."
      : "Track your mentorship sessions, from requests to completed sessions.";

  return (
    <Layout>
      <Paper
        variant="outlined"
        sx={ {
          p: 4,
          mb: 4,
          background: "linear-gradient(90deg, rgba(79,70,229,1) 0%, rgba(79,70,229,1) 35%, rgba(79,70,249,1) 100%)",
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
      />
    </Layout>
  );
};

export default SessionsPage;