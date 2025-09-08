"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Popover,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Card,
  CardContent,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  EditNote,
  Psychology,
  LinkedIn,
  Send,
  AccessTime,
  Close,
  PhotoLibrary,
} from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

import { useCreateLinkedInPostMutation } from "@/redux/textPostSlice";
import { useSchedulePostMutation } from "@/redux/services/schedulePostApi";
import CustomSnackbar from "@/components/CustomSnackbar";

// ✅ Import reusable components
import CreatePostBox from "./CreatePostBox";
import AIGenerateBox from "./AIGenerateBox";

interface LinkedInPostProps {
  sub: string | null;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

const LinkedInPost: React.FC<LinkedInPostProps> = ({ sub }) => {
  // ✅ Removed "refine"
  const [mode, setMode] = useState<"create" | "generate">("create");
  const [message, setMessage] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [scheduledDateTime, setScheduledDateTime] = useState<Dayjs | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
    icon?: React.ReactNode;
  }>({ open: false, severity: "success", message: "" });

  const [createPost, { isLoading, isError, error, isSuccess }] =
    useCreateLinkedInPostMutation();
  const [schedulePost, { isLoading: isScheduling, isSuccess: scheduleSuccess }] =
    useSchedulePostMutation();

  /** ---------------- Utilities ------------------ */
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

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const processFiles = (files: FileList) => {
    const maxImages = 10;
    const currentCount = selectedImages.length;
    const availableSlots = maxImages - currentCount;

    if (availableSlots <= 0) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Maximum ${maxImages} images allowed`,
      });
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

    filesToProcess.forEach((file) => {
      if (!validImageTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          severity: "error",
          message: `${file.name} is not a valid image format`,
        });
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        setSnackbar({
          open: true,
          severity: "error",
          message: `${file.name} is too large. Max size is 8MB`,
        });
        return;
      }

      const imageFile: ImageFile = {
        file,
        preview: URL.createObjectURL(file),
        id: generateId(),
      };

      setSelectedImages((prev) => [...prev, imageFile]);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    setSelectedImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  const clearAllImages = () => {
    selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setSelectedImages([]);
  };

  /** ---------------- Build Payload ------------------ */
  const buildPayload = async () => {
    const storedSub =
      typeof window !== "undefined" ? localStorage.getItem("linkedin_sub") : null;
    const content = mode === "generate" ? aiMessage : message;

    if (!storedSub || !content.trim()) return null;

    let imagesPayload: { image: string }[] | undefined;
    if (selectedImages.length > 0) {
      imagesPayload = await Promise.all(
        selectedImages.map(async (imageFile) => {
          const base64 = await toBase64(imageFile.file);
          return { image: base64 };
        })
      );
    }

    return { sub: storedSub, message: content, ...(imagesPayload && { images: imagesPayload }) };
  };

  /** ---------------- Handlers ------------------ */
  const handlePost = async () => {
    try {
      const payload = await buildPayload();
      if (!payload) return;

      const response = await createPost({
        ...payload,
        post_message: payload.message,
      }).unwrap();

      if (response?.id) {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Your post has been published successfully on LinkedIn!",
          icon: <CheckCircle />,
        });
        setMessage("");
        setAiMessage("");
        clearAllImages();
      }
    } catch {
      setSnackbar({
        open: true,
        severity: "error",
        message: "An error occurred while creating your post",
      });
    }
  };

  const handleSchedule = async () => {
    try {
      const payload = await buildPayload();
      if (!payload || !scheduledDateTime) return;

      await schedulePost({
        ...payload,
        scheduled_time: scheduledDateTime.toISOString(),
      }).unwrap();

      setSnackbar({
        open: true,
        severity: "success",
        message: "Your post has been scheduled successfully!",
        icon: <Schedule />,
      });
      setMessage("");
      setAiMessage("");
      setScheduledDateTime(null);
      handleScheduleClose();
    } catch {
      setSnackbar({
        open: true,
        severity: "error",
        message: "An error occurred while scheduling your post",
      });
    }
  };

  const handleScheduleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleScheduleClose = () => setAnchorEl(null);

  const handleAIGenerate = () => {
    setAiMessage("✨ This is an AI-generated suggestion for your LinkedIn post.");
  };

  /** ---------------- Effects ------------------ */
  useEffect(() => {
    if (isSuccess) {
      setSnackbar({
        open: true,
        severity: "success",
        message: "Post created successfully!",
        icon: <CheckCircle />,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setSnackbar({
        open: true,
        severity: "error",
        message: error ? JSON.stringify(error) : "Failed to create post",
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (scheduleSuccess) {
      setSnackbar({
        open: true,
        severity: "success",
        message: "Post scheduled successfully!",
        icon: <Schedule />,
      });
    }
  }, [scheduleSuccess]);

  /** ---------------- UI Config ------------------ */
  const getModeConfig = (modeType: string) => {
    const configs = {
      create: { icon: <EditNote />, label: "Create" },
      generate: { icon: <Psychology />, label: "AI Generate" },
    };
    return configs[modeType as keyof typeof configs] || configs.create;
  };

  /** ---------------- Render ------------------ */
  return (
    <Box display="flex" gap={4} alignItems="flex-start">
      <Box flex={1}>
        <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid #e3f2fd" }}>
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 4 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                <LinkedIn />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h4" fontWeight={700}>
                  LinkedIn Post
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Craft engaging posts that drive results
                </Typography>
              </Box>
            </Box>

            {/* Mode Switcher */}
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_, val) => val && setMode(val)}
              sx={{ mb: 4 }}
            >
              {["create", "generate"].map((modeType) => {
                const config = getModeConfig(modeType);
                return (
                  <ToggleButton key={modeType} value={modeType}>
                    {config.icon}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {config.label}
                    </Typography>
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>

            {/* Modes */}
            {mode === "create" && (
              <CreatePostBox message={message} setMessage={setMessage} />
            )}

            {mode === "generate" && (
              <AIGenerateBox
                aiMessage={aiMessage}
                setAiMessage={setAiMessage}
                // onGenerate={handleAIGenerate}
              />
            )}

            {/* Shared Image Upload */}
            <Box sx={{ mb: 3 }}>
              <Button variant="outlined" component="label" startIcon={<PhotoLibrary />}>
                Add Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </Button>

              {selectedImages.length > 0 && (
                <Button
                  color="error"
                  onClick={clearAllImages}
                  startIcon={<Close />}
                  sx={{ ml: 2 }}
                >
                  Clear All
                </Button>
              )}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 2,
                  mt: 2,
                }}
              >
                {selectedImages.map((img) => (
                  <Box key={img.id} sx={{ position: "relative" }}>
                    <img
                      src={img.preview}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      onClick={() => removeImage(img.id)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.6)",
                        color: "white",
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Actions */}
            <Box display="flex" justifyContent="space-between">
              <Tooltip title="Schedule Post" arrow>
                <IconButton onClick={handleScheduleClick}>
                  <Schedule />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                size="large"
                onClick={handlePost}
                disabled={isLoading || (!message.trim() && !aiMessage.trim())}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Send />
                  )
                }
              >
                {isLoading ? "Posting..." : "Publish Post"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Schedule Popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleScheduleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Box sx={{ p: 3, width: 320 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Schedule Date & Time"
                value={scheduledDateTime}
                onChange={(newValue) => setScheduledDateTime(newValue)}
                slotProps={{ textField: { fullWidth: true, sx: { mb: 2 } } }}
              />
            </LocalizationProvider>
            <Button
              fullWidth
              variant="contained"
              disabled={!scheduledDateTime || isScheduling}
              onClick={handleSchedule}
              startIcon={
                isScheduling ? <CircularProgress size={16} color="inherit" /> : <AccessTime />
              }
            >
              {isScheduling ? "Scheduling..." : "Schedule"}
            </Button>
          </Box>
        </Popover>
      </Box>

      {/* ✅ Unified Snackbar */}
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

export default LinkedInPost;
