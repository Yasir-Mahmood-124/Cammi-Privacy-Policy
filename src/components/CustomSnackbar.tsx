// src/components/CustomSnackbar.tsx
"use client";

import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  severity: SnackbarSeverity;
  message: string;
  duration?: number;
  icon?: React.ReactNode;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  onClose,
  severity,
  message,
  duration = 5000,
  icon,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={Slide}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        icon={icon ?? false}
        sx={{ borderRadius: 3, fontWeight: 500 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
