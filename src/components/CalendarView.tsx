"use client";

import React from "react";
import { Paper, Typography, Box, Tooltip } from "@mui/material";

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

// 24-hour slots: 0–11 AM, 12–23 PM
const HOURS = [...Array.from({ length: 12 }, (_, i) => i), ...Array.from({ length: 12 }, (_, i) => i + 12)];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatHour = (hour: number) => {
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${ampm}`;
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

  return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`;
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
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
        maxWidth: "none",
        overflow: "auto",
        boxSizing: "border-box",
        bgcolor: "background.default",
        borderRadius: 2,
        boxShadow: 3,
        "&::-webkit-scrollbar": { width: 8, height: 8 },
        "&::-webkit-scrollbar-thumb": { bgcolor: "primary.main", borderRadius: 4 },
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Weekly Calendar View
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "60px repeat(7, 1fr)",
          gridAutoRows: "80px",
          borderTop: "1px solid",
          borderLeft: "1px solid",
          borderColor: "divider",
          userSelect: "none",
        }}
      >
        {/* Top-left empty cell */}
        <Box sx={{ borderRight: "1px solid", borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }} />

        {/* Day headers */}
        {DAYS.map((day) => (
          <Box
            key={day}
            sx={{
              borderRight: "1px solid",
              borderBottom: "1px solid",
              borderColor: "divider",
              textAlign: "center",
              fontWeight: "bold",
              bgcolor: "background.paper",
              lineHeight: "80px",
              fontSize: "1rem",
              color: "text.primary",
              userSelect: "none",
            }}
          >
            {day}
          </Box>
        ))}

        {/* Time slots and posts */}
        {HOURS.map((hour) => (
          <React.Fragment key={hour}>
            {/* Time label column */}
            <Box
              sx={{
                borderRight: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
                textAlign: "center",
                fontSize: "0.75rem",
                color: "text.secondary",
                lineHeight: "80px",
                fontWeight: "medium",
                bgcolor: "background.paper",
                userSelect: "none",
              }}
            >
              {formatHour(hour)}
            </Box>

            {/* Day cells */}
            {DAYS.map((_, dayIndex) => {
              const cellPosts = postsMap[dayIndex]?.[hour] || [];

              let cellBg = "inherit";
              let hoverBg = "action.hover";
              let textColor = "inherit";

              if (cellPosts.length) {
                const firstPost = cellPosts[0];
                if (firstPost.status === "pending") {
                  cellBg = "success.main";
                  hoverBg = "success.dark";
                  textColor = "primary.contrastText";
                } else {
                  cellBg = "info.main";
                  hoverBg = "info.dark";
                  textColor = "primary.contrastText";
                }
              }

              return (
                <Box
                  key={dayIndex}
                  sx={{
                    borderRight: "1px solid",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    p: 0.5,
                    overflow: "hidden",
                    position: "relative",
                    bgcolor: cellBg,
                    cursor: cellPosts.length ? "pointer" : "default",
                    color: textColor,
                    fontSize: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    transition: "background-color 0.3s",
                    "&:hover": { bgcolor: hoverBg },
                  }}
                >
                  {cellPosts.map((post) => {
                    const formattedDateTime = formatDateTime(post.post_time);

                    return (
                      <Tooltip key={post.id} title={`${formattedDateTime} - ${post.message}`} arrow>
                        <Box
                          sx={{
                            width: "100%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            mb: 0.3,
                          }}
                        >
                          <strong>{formattedDateTime}</strong> - {post.message}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default CalendarView;
