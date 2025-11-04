import React, { useContext } from "react";
import {
  Drawer,
  Toolbar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from '../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  drawerWidth?: number;
  onLogout: () => void;
}

const NewSidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
  drawerWidth = 240,
  onLogout,
}) => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Servis Kayıtları", icon: <BuildIcon />, path: "/services" },
    { text: "Kullanıcılar", icon: <PeopleIcon />, path: "/users" },
    { text: "Bildirimler", icon: <PeopleIcon />, path: "/notifications" },

    // { text: "Ayarlar", icon: <SettingsIcon />, path: "/settings" },
  ];
  const { user } = useContext(AuthContext);
  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo ve Başlık */}
      <Toolbar sx={{ px: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Netline Yazılım
        </Typography>
      </Toolbar>
      <Divider />

      {/* Menü öğeleri */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Logout */}
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Çıkış Yap
                {user && (
                  <Typography component="span" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    ({user.first_name || user.username})
                  </Typography>
                )}
              </Typography>
            } />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      {/* Permanent drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default NewSidebar;
