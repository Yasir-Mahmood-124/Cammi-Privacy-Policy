

// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Box, useTheme } from "@mui/material";
// import Sidebar from "@/components/Sidebar";
// import LinkedInPost from "@/components/LinkedInPost";
// import CalendarView from "@/components/CalendarView";

// const Dashboard = () => {
//   const theme = useTheme();
//   const searchParams = useSearchParams();
//   const subFromUrl = searchParams.get("sub");

//   const [selectedMenu, setSelectedMenu] = useState("linkedin-post");
//   const [sub, setSub] = useState<string | null>(null);

// const [posts, setPosts] = useState([
//   {
//     id: "1",
//     post_time: "2024-06-01T10:00:00Z",
//     schedule_time: "2024-06-02T09:00:00Z",
//     message: "Post about React",
//     status: "pending" as const,
//   },
//   {
//     id: "2",
//     post_time: "2024-06-03T14:30:00Z",
//     schedule_time: "2024-06-04T12:00:00Z",
//     message: "Post about Next.js",
//     status: "scheduled" as const,
//   },
//   {
//     id: "3",
//     post_time: "2024-06-02T08:00:00Z",
//     schedule_time: "2024-06-02T15:00:00Z",
//     message: "Post about TypeScript",
//     status: "pending" as const,
//   },
//   {
//     id: "4",
//     post_time: "2024-06-03T11:00:00Z",
//     schedule_time: "2024-06-05T18:00:00Z",
//     message: "Post about Node.js",
//     status: "scheduled" as const,
//   },
//   {
//     id: "5",
//     post_time: "2024-06-05T09:30:00Z",
//     schedule_time: "2024-06-06T10:00:00Z",
//     message: "Post about MongoDB",
//     status: "pending" as const,
//   },
//   {
//     id: "6",
//     post_time: "2024-06-06T07:15:00Z",
//     schedule_time: "2024-06-07T14:00:00Z",
//     message: "Post about Express.js",
//     status: "scheduled" as const,
//   },
//   {
//     id: "7",
//     post_time: "2024-06-07T13:45:00Z",
//     schedule_time: "2024-06-07T16:00:00Z",
//     message: "Post about UI/UX Design",
//     status: "pending" as const,
//   },
//   {
//     id: "8",
//     post_time: "2024-06-08T16:20:00Z",
//     schedule_time: "2024-06-09T11:00:00Z",
//     message: "Post about Git & GitHub",
//     status: "scheduled" as const,
//   },
//   {
//     id: "9",
//     post_time: "2024-06-09T10:10:00Z",
//     schedule_time: "2024-06-10T09:00:00Z",
//     message: "Post about Agile Practices",
//     status: "pending" as const,
//   },
//   {
//     id: "10",
//     post_time: "2024-06-10T12:00:00Z",
//     schedule_time: "2024-06-11T17:00:00Z",
//     message: "Post about Testing with Jest Post about Testing with Jest Post about Testing with Jest Post about Testing with Jest Post about Testing with Jest",
//     status: "scheduled" as const,
//   },
// ]);



//   useEffect(() => {
//     if (subFromUrl) {
//       localStorage.setItem("linkedin_sub", subFromUrl);
//       setSub(subFromUrl);
//     } else {
//       const savedSub = localStorage.getItem("linkedin_sub");
//       if (savedSub) setSub(savedSub);
//     }
//   }, [subFromUrl]);

//   const menuItems = [
//     { key: "linkedin-post", label: "LinkedIn Post" },
//     { key: "view", label: "View" },
//   ];

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
//       <Sidebar menuItems={menuItems} selectedMenu={selectedMenu} onSelect={setSelectedMenu} />

//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         {selectedMenu === "linkedin-post" && <LinkedInPost sub={sub} />}
//         {selectedMenu === "view" && <CalendarView posts={posts} />}
//       </Box>
//     </Box>
//   );
// };

// export default Dashboard;



"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, useTheme } from "@mui/material";
import Sidebar from "@/components/Sidebar";
import LinkedInPost from "@/components/LinkedInPost";
import CalendarView from "@/components/CalendarView";
import { useGetPostsMutation } from "@/redux/viewApiSlice";

const Dashboard = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const subFromUrl = searchParams.get("sub");

  const [selectedMenu, setSelectedMenu] = useState("linkedin-post");
  const [sub, setSub] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]); // Will hold API response

  const [getPosts, { data, isLoading, error }] = useGetPostsMutation();

  // Save sub and fetch posts
  useEffect(() => {
    const fetchPosts = async (currentSub: string) => {
      try {
        const result = await getPosts({ sub: currentSub }).unwrap();
        // Map API response to match CalendarView's expected shape
        const mappedPosts = result.map((item: any, index: number) => ({
          id: item.post_urn || `scheduled-${index}`,
          post_time: item.post_time,
          schedule_time: item.scheduled_time || item.post_time,
          message: item.message || item.message || item.post_urn || "",
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
    { key: "linkedin-post", label: "LinkedIn Post" },
    { key: "view", label: "View" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <Sidebar menuItems={menuItems} selectedMenu={selectedMenu} onSelect={setSelectedMenu} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {selectedMenu === "linkedin-post" && <LinkedInPost sub={sub} />}
        {selectedMenu === "view" && (
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
