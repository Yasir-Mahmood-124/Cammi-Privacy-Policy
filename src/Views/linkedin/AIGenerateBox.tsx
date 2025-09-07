"use client";

import { TextField, Box, Button } from "@mui/material";
import { Psychology } from "@mui/icons-material";

interface AIGenerateBoxProps {
  aiMessage: string;
  setAiMessage: (val: string) => void;
  onGenerate: () => void;
}

const AIGenerateBox: React.FC<AIGenerateBoxProps> = ({ aiMessage, setAiMessage, onGenerate }) => {
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

      <Button
        variant="outlined"
        startIcon={<Psychology />}
        onClick={onGenerate}
      >
        AI Generate
      </Button>
    </Box>
  );
};

export default AIGenerateBox;
