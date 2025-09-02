// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import {
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   CircularProgress,
//   useTheme,
// } from "@mui/material";
// import { useCreateLinkedInPostMutation } from "@/redux/textPostSlice";

// const Dashboard = () => {
//   const theme = useTheme(); // 👈 Access global theme

//   const searchParams = useSearchParams();
//   const subFromUrl = searchParams.get("sub");

//   const [selectedMenu, setSelectedMenu] = useState("linkedin-post");
//   const [message, setMessage] = useState("");
//   const [sub, setSub] = useState<string | null>(null);

//   const [createPost, { data, isLoading, isError, error }] =
//     useCreateLinkedInPostMutation();

//   // Save sub into localStorage
//   useEffect(() => {
//     if (subFromUrl) {
//       localStorage.setItem("linkedin_sub", subFromUrl);
//       setSub(subFromUrl);
//     } else {
//       const savedSub = localStorage.getItem("linkedin_sub");
//       if (savedSub) setSub(savedSub);
//     }
//   }, [subFromUrl]);

//   const handlePost = async () => {
//     if (!sub || !message.trim()) return;
//     await createPost({ sub, post_message: message });
//   };

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
//       {/* Sidebar */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: 240,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: 240,
//             boxSizing: "border-box",
//             bgcolor: theme.palette.background.paper,
//           },
//         }}
//       >
//         <Typography
//           variant="h6"
//           sx={{
//             m: 2,
//             fontWeight: 600,
//             color: theme.palette.primary.main,
//           }}
//         >
//           Dashboard
//         </Typography>
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton
//               selected={selectedMenu === "linkedin-post"}
//               onClick={() => setSelectedMenu("linkedin-post")}
//             >
//               <ListItemText
//                 primary="LinkedIn Post"
//                 primaryTypographyProps={{
//                   sx: { fontWeight: selectedMenu === "linkedin-post" ? 600 : 400 },
//                 }}
//               />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Drawer>

//       {/* Main Content */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//         {selectedMenu === "linkedin-post" && (
//           <Paper sx={{ p: 3, maxWidth: 800 }}>
//             <Typography variant="h5" gutterBottom color="text.primary">
//               Create LinkedIn Post
//             </Typography>

//             <TextField
//               fullWidth
//               multiline
//               rows={6}
//               placeholder="Write your post here..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               sx={{ mb: 2 }}
//             />

//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handlePost}
//               disabled={isLoading}
//             >
//               {isLoading ? <CircularProgress size={24} /> : "Post"}
//             </Button>

//             {data && (
//               <Typography color="success.main" sx={{ mt: 2 }}>
//                 ✅ Post created successfully! ID: {data.id}
//               </Typography>
//             )}

//             {isError && (
//               <Typography color="error" sx={{ mt: 2 }}>
//                 ❌ Error: {JSON.stringify(error)}
//               </Typography>
//             )}
//           </Paper>
//         )}
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

const Dashboard = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const subFromUrl = searchParams.get("sub");

  const [selectedMenu, setSelectedMenu] = useState("linkedin-post");
  const [sub, setSub] = useState<string | null>(null);

  // Save sub into localStorage
  useEffect(() => {
    if (subFromUrl) {
      localStorage.setItem("linkedin_sub", subFromUrl);
      setSub(subFromUrl);
    } else {
      const savedSub = localStorage.getItem("linkedin_sub");
      if (savedSub) setSub(savedSub);
    }
  }, [subFromUrl]);

  // Dynamic menu items
  const menuItems = [
    { key: "linkedin-post", label: "LinkedIn Post" },
    // Future menu items can be added here
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        selectedMenu={selectedMenu}
        onSelect={setSelectedMenu}
      />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {selectedMenu === "linkedin-post" && <LinkedInPost sub={sub} />}
      </Box>
    </Box>
  );
};

export default Dashboard;

