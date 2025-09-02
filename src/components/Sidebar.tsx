"use client";

import { Drawer, List, ListItem, ListItemButton, ListItemText, Typography, useTheme } from "@mui/material";

interface SidebarProps {
  menuItems: { key: string; label: string }[];
  selectedMenu: string;
  onSelect: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, selectedMenu, onSelect }) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          m: 2,
          fontWeight: 600,
          color: theme.palette.primary.main,
        }}
      >
        Dashboard
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={selectedMenu === item.key}
              onClick={() => onSelect(item.key)}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: { fontWeight: selectedMenu === item.key ? 600 : 400 },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
