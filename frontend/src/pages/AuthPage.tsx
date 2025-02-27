import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Layout from "../components/common/Layout";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

const AuthPage: React.FC = () => {
  const { authType } = useParams<{ authType: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authType !== "login" && authType !== "signup") {
      navigate("/auth/login");
    }
  }, [authType, navigate]);

  return (
    <Layout maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        {authType === "login" ? <LoginForm /> : <SignupForm />}
      </Box>
    </Layout>
  );
};

export default AuthPage;
