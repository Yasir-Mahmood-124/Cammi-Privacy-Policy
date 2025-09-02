"use client";

import { useState } from "react";
import { Typography, TextField, Button, Paper, CircularProgress } from "@mui/material";
import { useCreateLinkedInPostMutation } from "@/redux/textPostSlice";

interface LinkedInPostProps {
  sub: string | null;
}

const LinkedInPost: React.FC<LinkedInPostProps> = ({ sub }) => {
  const [message, setMessage] = useState("");
  const [createPost, { data, isLoading, isError, error }] =
    useCreateLinkedInPostMutation();

  const handlePost = async () => {
    if (!sub || !message.trim()) return;
    await createPost({ sub, post_message: message });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom color="text.primary">
        Create LinkedIn Post
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={6}
        placeholder="Write your post here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handlePost}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Post"}
      </Button>

      {data && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          ✅ Post created successfully! ID: {data.id}
        </Typography>
      )}

      {isError && (
        <Typography color="error" sx={{ mt: 2 }}>
          ❌ Error: {JSON.stringify(error)}
        </Typography>
      )}
    </Paper>
  );
};

export default LinkedInPost;
