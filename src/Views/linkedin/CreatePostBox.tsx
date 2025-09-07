"use client";

import { TextField, Box } from "@mui/material";

interface CreatePostBoxProps {
  message: string;
  setMessage: (val: string) => void;
}

const CreatePostBox: React.FC<CreatePostBoxProps> = ({ message, setMessage }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        multiline
        rows={6}
        placeholder="What's on your mind?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </Box>
  );
};

export default CreatePostBox;
