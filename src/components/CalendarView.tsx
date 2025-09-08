"use client";

import React from "react";
import {
  Paper,
  Typography,
  Box,
  Tooltip,
  Chip,
  Stack,
  Card,
  CardContent,
  Badge,
} from "@mui/material";
import { 
  CheckCircleOutlined, 
  ScheduleOutlined, 
  SendOutlined,
  CalendarTodayOutlined,
  AccessTimeOutlined,
  MessageOutlined
} from "@mui/icons-material";

interface Post {
  id: string;
  post_time: string;
  schedule_time: string;
  message: string;
  status: "pending" | "scheduled" | "posted";
}

interface CalendarViewProps {
  posts: Post[];
}

// 24-hour slots
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ABBREVIATIONS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatHour = (hour: number) => {
  if (hour === 0) return "12:00 AM";
  if (hour === 12) return "12:00 PM";
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return {
    date: `${day}/${month}/${year}`,
    time: `${hour12}:${minutes} ${ampm}`,
    fullDateTime: `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`
  };
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        icon: <ScheduleOutlined sx={{ fontSize: 14 }} />,
        color: "#ff9800" as const,
        bgColor: "#fff3e0",
        label: "Pending",
        chipColor: "warning" as const
      };
    case "scheduled":
      return {
        icon: <SendOutlined sx={{ fontSize: 14 }} />,
        color: "#2196f3" as const,
        bgColor: "#e3f2fd",
        label: "Scheduled",
        chipColor: "primary" as const
      };
    case "posted":
      return {
        icon: <CheckCircleOutlined sx={{ fontSize: 14 }} />,
        color: "#4caf50" as const,
        bgColor: "#e8f5e8",
        label: "Posted",
        chipColor: "success" as const
      };
    default:
      return {
        icon: <ScheduleOutlined sx={{ fontSize: 14 }} />,
        color: "#757575" as const,
        bgColor: "#f5f5f5",
        label: "Unknown",
        chipColor: "default" as const
      };
  }
};

const CalendarView: React.FC<CalendarViewProps> = ({ posts }) => {
  const postsMap: Record<number, Record<number, Post[]>> = {};

  posts.forEach((post) => {
    const date = new Date(post.schedule_time);
    const day = date.getDay();
    const hour = date.getHours();

    if (!postsMap[day]) postsMap[day] = {};
    if (!postsMap[day][hour]) postsMap[day][hour] = [];
    postsMap[day][hour].push(post);
  });

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        // Remove overflow auto and replace with hidden to prevent scrollbars
        overflow: "hidden",
        boxSizing: "border-box",
        bgcolor: "#fafafa",
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Enhanced Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          pb: 2,
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0, // Prevent header from shrinking
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CalendarTodayOutlined 
            sx={{ 
              fontSize: 28, 
              color: "#1976d2",
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }} 
          />
          <Typography
            variant="h4"
            sx={{ 
              fontWeight: 600, 
              color: "#1a1a1a",
              letterSpacing: "-0.5px"
            }}
          >
            Event Calendar
          </Typography>
        </Box>

        {/* Enhanced Legend */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
            Status:
          </Typography>
          {["pending", "scheduled", "posted"].map((status) => {
            const config = getStatusConfig(status);
            return (
              <Chip
                key={status}
                icon={config.icon}
                label={config.label}
                size="small"
                sx={{
                  bgcolor: config.bgColor,
                  color: config.color,
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  border: `1px solid ${config.color}20`,
                  "& .MuiChip-icon": {
                    color: config.color
                  }
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* Calendar Container with proper overflow handling */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          "&::-webkit-scrollbar": { 
            width: 6, 
            height: 6 
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#bdbdbd",
            borderRadius: 3,
            "&:hover": {
              bgcolor: "#9e9e9e"
            }
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "#f5f5f5",
            borderRadius: 3
          }
        }}
      >
        {/* Enhanced Calendar Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "100px repeat(7, minmax(120px, 1fr))", // Fixed time column, flexible day columns
            gap: "1px",
            bgcolor: "#e0e0e0",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            minWidth: "fit-content", // Ensure grid doesn't shrink below content
          }}
        >
          {/* Empty cell top-left */}
          <Box
            sx={{
              bgcolor: "#f8f9fa",
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "sticky",
              top: 0,
              left: 0,
              zIndex: 3,
              borderBottom: "2px solid #e0e0e0"
            }}
          >
            <AccessTimeOutlined sx={{ color: "#666", fontSize: 18 }} />
          </Box>

          {/* Enhanced Day headers */}
          {DAY_ABBREVIATIONS.map((day, index) => (
            <Box
              key={day}
              sx={{
                bgcolor: "#f8f9fa",
                minHeight: "50px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "sticky",
                top: 0,
                zIndex: 2,
                borderBottom: "2px solid #e0e0e0"
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#1a1a1a",
                  fontSize: "0.8rem"
                }}
              >
                {day}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "#666",
                  fontSize: "0.7rem"
                }}
              >
                {DAYS[index]}
              </Typography>
            </Box>
          ))}

          {/* Enhanced Time slots */}
          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              {/* Enhanced Time labels */}
              <Box
                sx={{
                  bgcolor: "#f8f9fa",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  borderRight: "2px solid #e0e0e0"
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    color: "#666",
                    fontWeight: 500,
                    textAlign: "center",
                    lineHeight: 1.2
                  }}
                >
                  {formatHour(hour)}
                </Typography>
              </Box>

              {/* Enhanced Day cells */}
              {DAY_ABBREVIATIONS.map((_, dayIndex) => {
                const cellPosts = postsMap[dayIndex]?.[hour] || [];

                return (
                  <Box
                    key={dayIndex}
                    sx={{
                      bgcolor: "#ffffff",
                      minHeight: "80px",
                      p: 0.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      transition: "background-color 0.2s ease",
                      overflow: "hidden", // Prevent cell content from overflowing
                      "&:hover": {
                        bgcolor: "#f5f5f5",
                      },
                    }}
                  >
                    <Stack spacing={0.5} sx={{ height: "100%" }}>
                      {cellPosts.map((post) => {
                        const { date, time } = formatDateTime(post.post_time);
                        const statusConfig = getStatusConfig(post.status);

                        return (
                          <Tooltip
                            key={post.id}
                            title={
                              <Box sx={{ p: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {post.message}
                                </Typography>
                                <Typography variant="caption" sx={{ display: "block", opacity: 0.8 }}>
                                  📅 {date} ⏰ {time}
                                </Typography>
                                <Typography variant="caption" sx={{ display: "block", opacity: 0.8 }}>
                                  Status: {statusConfig.label}
                                </Typography>
                              </Box>
                            }
                            arrow
                            placement="top"
                          >
                            <Card
                              elevation={0}
                              sx={{
                                bgcolor: statusConfig.bgColor,
                                border: `1px solid ${statusConfig.color}30`,
                                borderRadius: 1,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                minWidth: 0, // Allow card to shrink
                                "&:hover": {
                                  transform: "translateY(-1px)",
                                  boxShadow: `0 2px 8px ${statusConfig.color}20`,
                                  borderColor: `${statusConfig.color}60`
                                },
                              }}
                            >
                              <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                                  <Box 
                                    sx={{ 
                                      color: statusConfig.color,
                                      mt: 0.1,
                                      flexShrink: 0 // Prevent icon from shrinking
                                    }}
                                  >
                                    {statusConfig.icon}
                                  </Box>
                                  <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: "0.6rem",
                                        color: "#666",
                                        fontWeight: 500,
                                        display: "block",
                                        mb: 0.25
                                      }}
                                    >
                                      {time}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        color: "#1a1a1a",
                                        lineHeight: 1.2,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        wordBreak: "break-word" // Handle long words
                                      }}
                                    >
                                      {post.message}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                {/* Status indicator */}
                                <Box 
                                  sx={{ 
                                    display: "flex", 
                                    justifyContent: "flex-end",
                                    mt: 0.5
                                  }}
                                >
                                  <Badge
                                    sx={{
                                      "& .MuiBadge-badge": {
                                        bgcolor: statusConfig.color,
                                        color: "white",
                                        fontSize: "0.55rem",
                                        height: 14,
                                        minWidth: 14,
                                        borderRadius: 1
                                      }
                                    }}
                                    badgeContent={statusConfig.label.charAt(0)}
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          </Tooltip>
                        );
                      })}
                    </Stack>
                  </Box>
                );
              })}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default CalendarView;