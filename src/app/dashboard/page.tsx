"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, useTheme } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import CalendarView from "@/components/CalendarView";
import { useGetPostsMutation } from "@/redux/services/viewApiSlice";
import Linkedin from "../../Views/linkedin/index";



// MUI Icons
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EventIcon from "@mui/icons-material/Event";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote"; // TikTok alternative
import LanguageIcon from "@mui/icons-material/Language"; // For WordPress

const Dashboard = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const subFromUrl = searchParams.get("sub");

  const [selectedMenu, setSelectedMenu] = useState("linkedin");
  const [sub, setSub] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const [getPosts, { data, isLoading, error }] = useGetPostsMutation();

  // Save sub and fetch posts
  useEffect(() => {
    const fetchPosts = async (currentSub: string) => {
      try {
        const result = await getPosts({ sub: currentSub }).unwrap();
        const mappedPosts = result.map((item: any, index: number) => ({
          id: item.post_urn || `scheduled-${index}`,
          post_time: item.post_time,
          schedule_time: item.scheduled_time || item.post_time,
          message: item.message || item.post_urn || "",
          status: item.status === "pending" ? "pending" : "posted",
        }));
        setPosts(mappedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    if (subFromUrl) {
      localStorage.setItem("linkedin_sub", subFromUrl);
      setSub(subFromUrl);
      fetchPosts(subFromUrl);
    } else {
      const savedSub = localStorage.getItem("linkedin_sub");
      if (savedSub) {
        setSub(savedSub);
        fetchPosts(savedSub);
      }
    }
  }, [subFromUrl, getPosts]);

  const menuItems = [
    { key: "linkedin", label: "LinkedIn", icon: <LinkedInIcon /> },
    { key: "events", label: "Events", icon: <EventIcon /> },
    { key: "facebook", label: "Facebook (Coming Soon)", icon: <FacebookIcon />, disabled: true },
    { key: "instagram", label: "Instagram (Coming Soon)", icon: <InstagramIcon />, disabled: true },
    { key: "tiktok", label: "TikTok (Coming Soon)", icon: <MusicNoteIcon />, disabled: true },
    { key: "wordpress", label: "WordPress (Coming Soon)", icon: <LanguageIcon />, disabled: true },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <Sidebar
        menuItems={menuItems}
        selectedMenu={selectedMenu}
        onSelect={setSelectedMenu}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {selectedMenu === "linkedin" && <Linkedin/>}
        {selectedMenu === "events" && (
          <>
            {isLoading ? (
              <p>Loading posts...</p>
            ) : error ? (
              <p>Error fetching posts</p>
            ) : (
              <CalendarView posts={posts} />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
