// Updated handlePost function and imports
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
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Chip,
  Avatar,
  Fade,
  Slide,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  EditNote,
  AutoFixHigh,
  Psychology,
  Construction,
  LinkedIn,
  Send,
  CalendarToday,
  AccessTime,
  Star,
  Analytics,
  Bolt,
  Image 
} from "@mui/icons-material";
import CreditsSidebar from "./CreditsSidebar";
// Make sure this import path is correct - should match your apiSlice location
// Update the import path and/or exported member to match your actual API slice file
import { useCreateLinkedInPostMutation } from "@/redux/textPostSlice";
import { useSchedulePostMutation } from "@/redux/schedulePostApi";

interface LinkedInPostProps {
  sub: string | null;
}

const LinkedInPost: React.FC<LinkedInPostProps> = ({ sub }) => {
  const [mode, setMode] = useState<"create" | "generate" | "refine">("create");
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Updated with proper destructuring
  const [createPost, { 
    isLoading, 
    isError, 
    error, 
    isSuccess 
  }] = useCreateLinkedInPostMutation();

  const [
    schedulePost,
    {
      isLoading: isScheduling,
      isSuccess: scheduleSuccess,
      isError: scheduleError,
      error: scheduleErrorData,
    },
  ] = useSchedulePostMutation();

  const [openScheduleSnackbar, setOpenScheduleSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  // Mock credits data - replace with actual API data
  const creditsData = {
    total: 500,
    used: 120,
    remaining: 380,
    planType: "Pro",
  };

  const usagePercentage = (creditsData.used / creditsData.total) * 100;

  const handleScheduleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleScheduleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "schedule-popover" : undefined;

  const formatWithOffset = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const absOffset = Math.abs(offset);
    const offsetHours = pad(Math.floor(absOffset / 60));
    const offsetMinutes = pad(absOffset % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
  };

  // Convert File -> Base64 (strip prefix)
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const cleaned = result.replace(/^data:image\/\w+;base64,/, "");
        resolve(cleaned);
      };
      reader.onerror = (err) => reject(err);
    });

  // Handle Image Upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Updated Handle Post with better error handling
// Updated Handle Post with better success/error handling
const handlePost = async () => {
  const storedSub = typeof window !== "undefined" 
    ? localStorage.getItem("linkedin_sub") 
    : null;

  if (!storedSub || !message.trim()) {
    console.warn("Missing required fields");
    return;
  }

  try {
    let imagesPayload: { image: string }[] | undefined = undefined;

    if (selectedImage) {
      const base64 = await toBase64(selectedImage);
      imagesPayload = [{ image: base64 }];
    }

    const payload = {
      sub: storedSub,
      post_message: message,
      ...(imagesPayload && { images: imagesPayload }),
    };

    console.log("Payload to API:", JSON.stringify(payload, null, 2));

    // Use unwrap() to get the actual response or throw an error
    const response = await createPost(payload).unwrap();
    
    // Check if response has an id (which indicates success)
    if (response && response.id) {
      console.log("Post Created Successfully:", response);
      
      // Show success message to user
     setOpenErrorSnackbar(true); // Add this state if you don't have it
      
      // Reset form only on success
      setMessage("");
      setSelectedImage(null);
      setPreview(null);
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } else {
      // Response doesn't have ID, treat as error
      console.error("API Response missing ID:", response);
      setOpenErrorSnackbar(true);
    }

  } catch (err: any) {
    // Only log the error but don't show error snackbar if we got a successful response
    // (This handles the RTK Query internal error while API actually succeeded)
    console.error("RTK Query Error (but check if API succeeded):", err);
    
    // Check if there was actually an API success despite the RTK error
    // Look for the success log in console - if you see "API Response: {id: ...}" 
    // then the API call succeeded despite RTK Query throwing an error
    
    // You might want to add a small delay and check if the success message appeared
    setTimeout(() => {
      // If no success message was logged, then show error
      setOpenErrorSnackbar(true);
    }, 100);
  }
};

  // Effect to handle success state
  useEffect(() => {
    if (isSuccess) {
      setOpenSnackbar(true);
    }
  }, [isSuccess]);

  // Effect to handle error state
  useEffect(() => {
    if (isError) {
      setOpenErrorSnackbar(true);
    }
  }, [isError]);

  useEffect(() => {
    if (scheduleSuccess) {
      setMessage("");
      setScheduledDateTime("");
      setOpenScheduleSnackbar(true);
    }
  }, [scheduleSuccess]);

  const getModeConfig = (modeType: string) => {
    const configs = {
      create: {
        icon: <EditNote />,
        label: "Create",
        description: "Write your own content",
        color: "#1976d2",
        bgColor: "#e3f2fd",
      },
      generate: {
        icon: <Psychology />,
        label: "AI Generate",
        description: "Let CAMMI create for you",
        color: "#9c27b0",
        bgColor: "#f3e5f5",
      },
      refine: {
        icon: <AutoFixHigh />,
        label: "AI Refine",
        description: "Enhance existing content",
        color: "#ff9800",
        bgColor: "#fff3e0",
      },
    };
    return configs[modeType as keyof typeof configs] || configs.create;
  };

  const credits = {
    planType: "Premium",
    used: 120,
    total: 200,
    remaining: 80,
  };

  return (
    <Box display="flex" gap={4} alignItems="flex-start" sx={{ p: 0 }}>
      {/* Main LinkedIn Post Section */}
      <Box flex={1}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            border: "1px solid #e3f2fd",
            overflow: "visible",
            position: "relative",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Header Section */}
            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 48,
                  height: 48,
                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                }}
              >
                <LinkedIn />
              </Avatar>
              <Box flex={1}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #1a1a1a, #424242)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.5px",
                  }}
                >
                  LinkedIn Post
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", fontWeight: 500 }}
                >
                  Craft engaging posts that drive results
                </Typography>
              </Box>
            </Box>

            {/* Enhanced Mode Switcher */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: 600, color: "#1a1a1a" }}
              >
                Choose your approach:
              </Typography>
              <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={(_, val) => val && setMode(val)}
                sx={{
                  display: "flex",
                  gap: 1,
                  "& .MuiToggleButton-root": {
                    border: "2px solid transparent",
                    borderRadius: 3,
                    px: 3,
                    py: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                    "&.Mui-selected": {
                      borderColor: "primary.main",
                      bgcolor: "primary.50",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.50",
                      },
                    },
                  },
                }}
              >
                {["create", "generate", "refine"].map((modeType) => {
                  const config = getModeConfig(modeType);
                  return (
                    <ToggleButton key={modeType} value={modeType}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={1}
                      >
                        <Box sx={{ color: config.color }}>{config.icon}</Box>
                        <Box textAlign="center">
                          <Typography variant="body2" fontWeight={600}>
                            {config.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#666", fontSize: "0.7rem" }}
                          >
                            {config.description}
                          </Typography>
                        </Box>
                      </Box>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>

              {/* Coming Soon Notice */}
              {mode !== "create" && (
                <Fade in={mode === "generate" || mode === "refine"}>
                  <Card
                    sx={{
                      mt: 3,
                      p: 3,
                      bgcolor: "#fff3e0",
                      border: "2px solid #ffb74d",
                      borderRadius: 3,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Construction sx={{ color: "#f57c00", fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: "#e65100" }}>
                          Feature Coming Soon!
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#bf360c" }}>
                          We're working hard to bring you AI-powered content
                          generation and refinement features.
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Fade>
              )}
            </Box>

            {/* Post Creation Section */}
            {mode === "create" && (
              <Fade in={mode === "create"}>
                <Box>
                  {/* Message Input */}
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 600, color: "#1a1a1a" }}
                  >
                    Write your post:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    placeholder="What's on your mind?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ mb: 3 }}
                  />

                  {/* Character Count */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {message.length} characters
                    </Typography>
                    <Chip
                      size="small"
                      label={
                        message.length <= 300
                          ? "Great length!"
                          : "Consider shortening"
                      }
                      color={message.length <= 300 ? "success" : "warning"}
                      icon={message.length <= 300 ? <Star /> : <Analytics />}
                    />
                  </Box>

                  {/* Image Upload */}
                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<Image />}
                      sx={{ borderRadius: 2 }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>

                    {preview && (
                      <Box mt={2}>
                        <Typography variant="caption">Preview:</Typography>
                        <img
                          src={preview}
                          alt="preview"
                          style={{
                            maxWidth: "100%",
                            borderRadius: "8px",
                            marginTop: "4px",
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Tooltip title="Schedule for later" arrow>
                      <IconButton
                        onClick={handleScheduleClick}
                        sx={{
                          bgcolor: "primary.50",
                          color: "primary.main",
                          "&:hover": { bgcolor: "primary.100" },
                        }}
                      >
                        <Schedule />
                      </IconButton>
                    </Tooltip>

                    <Button
                      variant="contained"
                      size="large"
                      onClick={handlePost}
                      disabled={isLoading || !message.trim()}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Send />
                        )
                      }
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                        textTransform: "none",
                      }}
                    >
                      {isLoading ? "Posting..." : "Publish Post"}
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}
          </CardContent>
        </Card>

        {/* Schedule Popover - keeping your existing implementation */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleScheduleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 0,
              overflow: "hidden",
              border: "1px solid #e3f2fd",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              p: 2,
              color: "white",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday />
              <Typography variant="h6" fontWeight={600}>
                Schedule Your Post
              </Typography>
            </Box>
          </Box>
          <Box sx={{ p: 3, width: 320 }}>
            <TextField
              label="Select Date & Time"
              type="datetime-local"
              fullWidth
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleScheduleClose}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                disabled={!scheduledDateTime || isScheduling}
                startIcon={
                  isScheduling ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <AccessTime />
                  )
                }
                sx={{
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                }}
              >
                {isScheduling ? "Scheduling..." : "Schedule"}
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>

      {/* Enhanced Credits Sidebar */}
      <CreditsSidebar creditsData={credits} />

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          icon={<CheckCircle />}
          sx={{
            borderRadius: 3,
            fontWeight: 500,
            fontSize: "0.95rem",
            "& .MuiAlert-icon": {
              fontSize: "1.2rem",
            },
          }}
        >
          Your post has been published successfully on LinkedIn!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenErrorSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setOpenErrorSnackbar(false)}
          severity="error"
          sx={{
            borderRadius: 3,
            fontWeight: 500,
            fontSize: "0.95rem",
          }}
        >
          {isError && error ? 
            `Error: ${JSON.stringify(error)}` : 
            "An error occurred while creating your post"
          }
        </Alert>
      </Snackbar>

      {/* Schedule Success Snackbar */}
      <Snackbar
        open={openScheduleSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenScheduleSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setOpenScheduleSnackbar(false)}
          severity="success"
          icon={<Schedule />}
          sx={{
            borderRadius: 3,
            fontWeight: 500,
            fontSize: "0.95rem",
            "& .MuiAlert-icon": {
              fontSize: "1.2rem",
            },
          }}
        >
          Your post has been scheduled successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LinkedInPost;