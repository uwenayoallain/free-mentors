import React, { ReactNode } from "react";
import { Box, Container, Alert, Snackbar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import Navbar from "./Navbar";
import { clearSessionError, clearSuccessMessage } from "@/store/sessionsSlice";
import { clearError as clearUserError } from "@/store/usersSlice";
import { clearErrors } from "@/store/authSlice";
import { extractErrorMessage } from "@/utils";

interface LayoutProps {
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const Layout: React.FC<LayoutProps> = ({ children, maxWidth = "lg" }) => {
  const dispatch = useDispatch();
  const authError = useSelector((state: RootState) => state.auth.error);
  const userError = useSelector((state: RootState) => state.users.error);
  const sessionError = useSelector((state: RootState) => state.sessions.error);
  const successMessage = useSelector(
    (state: RootState) => state.sessions.successMessage,
  );

  const handleCloseError = () => {
    if (authError) dispatch(clearErrors());
    if (userError) dispatch(clearUserError());
    if (sessionError) dispatch(clearSessionError());
  };

  const handleCloseSuccess = () => {
    dispatch(clearSuccessMessage());
  };

  const errorMessage = extractErrorMessage(
    authError?.message || userError?.message || sessionError?.message);

  return (
    <Box sx={ { display: "flex", flexDirection: "column", minHeight: "100vh" } }>
      <Navbar />

      <Container
        component="main"
        maxWidth={ maxWidth }
        sx={ {
          flexGrow: 1,
          py: 4,
          display: "flex",
          flexDirection: "column",
        } }
      >
        { children }
      </Container>

      <Snackbar
        open={ !!errorMessage }
        autoHideDuration={ 6000 }
        onClose={ handleCloseError }
        anchorOrigin={ { vertical: "bottom", horizontal: "right" } }
      >
        <Alert onClose={ handleCloseError } severity="error" variant="filled">
          { errorMessage }
        </Alert>
      </Snackbar>

      <Snackbar
        open={ !!successMessage }
        autoHideDuration={ 6000 }
        onClose={ handleCloseSuccess }
        anchorOrigin={ { vertical: "bottom", horizontal: "right" } }
      >
        <Alert onClose={ handleCloseSuccess } severity="success" variant="filled">
          { successMessage }
        </Alert>
      </Snackbar>

      <Box
        component="footer"
        sx={ {
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: "primary.main",
          color: "white",
        } }
      >
        <Container maxWidth="lg">
          <Box sx={ { textAlign: "center" } }>
            Free Mentors &copy; { new Date().getFullYear() } - A social initiative
            for mentorship
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
