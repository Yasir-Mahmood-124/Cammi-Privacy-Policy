"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";

interface SidebarProps {
  menuItems: {
    key: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }[];
  selectedMenu: string;
  onSelect: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  selectedMenu,
  onSelect,
}) => {
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
        CAMMI
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={selectedMenu === item.key}
              onClick={() => !item.disabled && onSelect(item.key)}
              disabled={item.disabled}
              sx={{
                opacity: item.disabled ? 0.5 : 1,
                cursor: item.disabled ? "not-allowed" : "pointer",
              }}
            >
              {item.icon && (
                <ListItemIcon
                  sx={{
                    color:
                      selectedMenu === item.key && !item.disabled
                        ? theme.palette.primary.main
                        : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    fontWeight:
                      selectedMenu === item.key && !item.disabled ? 600 : 400,
                  },
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
