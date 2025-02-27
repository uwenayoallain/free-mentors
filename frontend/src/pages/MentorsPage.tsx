import React, { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { fetchMentors } from "../store/mentorsSlice";
import Layout from "@/components/common/Layout";
import MentorsList from "@/components/mentors/MentorsList";

const MentorsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMentors());
  }, [dispatch]);

  return (
    <Layout>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(to right, #1976d2, #64b5f6)",
        }}
      >
        <Box sx={{ color: "white", maxWidth: 800 }}>
          <Typography variant="h4" gutterBottom>
            Find Your Mentor
          </Typography>
          <Typography variant="body1">
            Connect with experienced professionals who can guide you on your
            career journey. Our mentors offer their time and expertise for free
            to help you grow and succeed.
          </Typography>
        </Box>
      </Paper>

      <MentorsList />
    </Layout>
  );
};

export default MentorsPage;
