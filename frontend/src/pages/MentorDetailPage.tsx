import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchMentor,
  fetchMentorReviews,
  clearCurrentMentor,
} from "../store/mentorsSlice";
import Layout from "../components/common/Layout";
import MentorDetail from "../components/mentors/MentorDetail";
import Loading from "../components/common/Loading";

const MentorDetailPage: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentMentor, reviews, isLoading, error } = useSelector(
    (state: RootState) => state.mentors,
  );

  useEffect(() => {
    if (mentorId) {
      dispatch(fetchMentor(mentorId));
      dispatch(fetchMentorReviews(mentorId));
    }

    return () => {
      dispatch(clearCurrentMentor());
    };
  }, [dispatch, mentorId]);

  if (isLoading && !currentMentor) {
    return (
      <Layout>
        <Loading message="Loading mentor profile..." />
      </Layout>
    );
  }

  if (error || !currentMentor) {
    return (
      <Layout>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Mentor Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The mentor you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/mentors")}
          >
            Back to Mentors
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/mentors")}
        >
          Back to Mentors
        </Button>
      </Box>

      <MentorDetail mentor={currentMentor} reviews={reviews} />
    </Layout>
  );
};

export default MentorDetailPage;
