import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
      light: "#818cf8",
      dark: "#3730a3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f97316",
      light: "#fb923c",
      dark: "#ea580c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
      contrastText: "#ffffff",
    },
    success: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#ffffff",
    },
    info: {
      main: "#0ea5e9",
      light: "#38bdf8",
      dark: "#0284c7",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#334155",
      secondary: "#64748b",
    },
    divider: "rgba(100, 116, 139, 0.12)",
  },
  typography: {
    fontFamily: "'Poppins', 'Open Sans', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.0125em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      letterSpacing: "-0.0125em",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        },
        containedPrimary: {},
        containedSecondary: {},
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 0px 0px rgba(0,0,0,0.01)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 0px 0px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
