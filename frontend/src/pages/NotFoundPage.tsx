import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom color="primary">
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography
            variant="body1"
            paragraph
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600 }}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default NotFoundPage;
