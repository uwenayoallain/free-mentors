import React, { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchAllMentors } from "@/store/usersSlice";
import Layout from "@/components/common/Layout";
import MentorsList from "@/components/mentors/MentorsList";

const MentorsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllMentors());
  }, [dispatch]);

  return (
    <Layout>
      <Paper
        sx={ {
          p: 4,
          mb: 4,
          background: "linear-gradient(90deg, rgba(79,70,229,1) 0%, rgba(79,70,229,1) 35%, rgba(79,70,249,1) 100%)",
        } }
      >
        <Box sx={ { color: "white", maxWidth: 800 } }>
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
