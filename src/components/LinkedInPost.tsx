"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Popover,
  Stack,
} from "@mui/material";
import { CheckCircle, Schedule } from "@mui/icons-material";
import { useCreateLinkedInPostMutation } from "@/redux/textPostSlice";
import { useSchedulePostMutation } from "@/redux/schedulePostApi";


interface LinkedInPostProps {
  sub: string | null;
}

const LinkedInPost: React.FC<LinkedInPostProps> = ({ sub }) => {
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // For scheduling popover
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState("");

  const [createPost, { data, isLoading, isError, error, isSuccess }] =
    useCreateLinkedInPostMutation();

  const handlePost = async () => {
    if (!sub || !message.trim()) return;
    await createPost({ sub, post_message: message });
  };

  const handleScheduleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleScheduleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "schedule-popover" : undefined;

  //Format DateTime
  // Utility function to format date with local timezone offset
const formatWithOffset = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const offset = -date.getTimezoneOffset(); // in minutes
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMinutes = pad(absOffset % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
};


const [schedulePost] = useSchedulePostMutation();

const handleSchedulePost = async () => {
  const storedSub =
    typeof window !== "undefined" ? localStorage.getItem("linkedin_sub") : null;

  if (!storedSub || !message.trim() || !scheduledDateTime) return;

  const localFormatted = formatWithOffset(new Date(scheduledDateTime));

  console.log("Scheduling post:", {
    sub: storedSub,
    message,
    scheduled_time: localFormatted,
  });

  await schedulePost({
    sub: storedSub,
    message,
    scheduled_time: localFormatted,
  });

  setAnchorEl(null);
};




  // Clear text and show popup when success
  useEffect(() => {
    if (isSuccess) {
      setMessage(""); // clear textbox
      setScheduledDateTime(""); // clear scheduled datetime
      setOpenSnackbar(true); // show success popup
    }
  }, [isSuccess]);

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

      {/* Container for schedule icon and post button aligned right */}
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        {/* Schedule Icon Button */}
        <IconButton
          aria-describedby={id}
          onClick={handleScheduleClick}
          color="primary"
          size="large"
          sx={{ alignSelf: "center" }}
          aria-label="schedule post"
        >
          <Schedule />
        </IconButton>

        {/* Post Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handlePost}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Post"}
        </Button>
      </Stack>

      {/* Schedule Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleScheduleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ sx: { p: 2, width: 280, borderRadius: 3 } }}
      >
        <Typography variant="h6" gutterBottom>
          Schedule Post
        </Typography>
        <TextField
          label="Date & Time"
          type="datetime-local"
          fullWidth
          value={scheduledDateTime}
          onChange={(e) => setScheduledDateTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSchedulePost}
          disabled={!scheduledDateTime || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Schedule"}
        </Button>
      </Popover>

      {/* Success Popup */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          icon={<CheckCircle fontSize="inherit" />}
          sx={{ borderRadius: 3, fontWeight: 500 }}
        >
          🎉 Posted on your LinkedIn successfully!
        </Alert>
      </Snackbar>

      {/* Error Message */}
      {isError && (
        <Typography color="error" sx={{ mt: 2 }}>
          ❌ Error: {JSON.stringify(error)}
        </Typography>
      )}
    </Paper>
  );
};

export default LinkedInPost;
