import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingProps {
  message?: string;
  fullHeight?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  fullHeight = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        height: fullHeight ? "100vh" : "auto",
      }}
    >
      <CircularProgress size={40} thickness={4} color="primary" />
      <Typography variant="body1" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
