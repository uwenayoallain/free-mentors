import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { store } from "./store";
import theme from "./theme/theme";

// Pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MentorsPage from "./pages/MentorsPage";
import MentorDetailPage from "./pages/MentorDetailPage";
import SessionsPage from "./pages/SessionsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminDashboard from "./pages/AdminDashboard";

// Auth protection
import ProtectedRoute from "./utils/ProtectedRoute";
import { UserType } from "./api/types";

const App: React.FC = () => {
  return (
    <Provider store={ store }>
      <ThemeProvider theme={ theme }>
        <LocalizationProvider dateAdapter={ AdapterDateFns }>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public Routes */ }
              <Route path="/" element={ <HomePage /> } />
              <Route path="/auth/:authType" element={ <AuthPage /> } />
              <Route path="/mentors" element={ <MentorsPage /> } />
              <Route path="/mentors/:mentorId" element={
                <ProtectedRoute>
                  <MentorDetailPage />
                </ProtectedRoute>
              } />

              {/* Protected Routes */ }
              <Route
                path="/sessions"
                element={
                  <ProtectedRoute>
                    <SessionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole={ UserType.ADMIN }>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Not Found */ }
              <Route path="/404" element={ <NotFoundPage /> } />
              <Route path="*" element={ <Navigate to="/404" replace /> } />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
