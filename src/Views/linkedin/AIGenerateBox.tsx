"use client";

import { useState } from "react";
import { TextField, Box, Button, CircularProgress } from "@mui/material";
import { Psychology, CheckCircle } from "@mui/icons-material";
import { useGenerateIdeaMutation } from "@/redux/services/aiGenerateApi";
import CustomSnackbar from "@/components/CustomSnackbar";

interface AIGenerateBoxProps {
  aiMessage: string;
  setAiMessage: (val: string) => void;
}

const AIGenerateBox: React.FC<AIGenerateBoxProps> = ({
  aiMessage,
  setAiMessage,
}) => {
  const [generateIdea, { isLoading }] = useGenerateIdeaMutation();

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
    icon?: React.ReactNode;
  }>({ open: false, severity: "success", message: "" });

  const handleGenerate = async () => {
    try {
      const response = await generateIdea({
        prompt: aiMessage || "Generate an engaging LinkedIn idea",
      }).unwrap();

      if (response?.groq_response) {
        setAiMessage(response.groq_response);

        setSnackbar({
          open: true,
          severity: "success",
          message: "AI suggestion generated successfully!",
          icon: <CheckCircle />,
        });
      }
    } catch (err) {
      console.error("AI Generate error:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to generate idea. Please try again.",
      });
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        multiline
        rows={6}
        placeholder="Let AI help you write..."
        value={aiMessage}
        onChange={(e) => setAiMessage(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Button aligned to the top-right under the textbox */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={isLoading ? <CircularProgress size={16} /> : <Psychology />}
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "AI Generate"}
        </Button>
      </Box>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        message={snackbar.message}
        icon={snackbar.icon}
      />
    </Box>
  );
};

export default AIGenerateBox;
