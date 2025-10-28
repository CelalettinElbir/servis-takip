import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import NewSidebar from "../components/NewSidebar";
import { AuthContext } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const NewDashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const theme = useTheme();

  // 🟩 900px altı için kontrol
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isAuthenticated && !token) {
      navigate("/login");
    }
  }, [isAuthenticated, token, navigate]);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <CssBaseline />

      {/* 🟩 AppBar sadece 900px altı ekranlarda görünecek */}
      {isMobile && (
        <AppBar
          position="fixed"
          color="transparent" // 🔹 bg kaldırıldı
          sx={{
            boxShadow: "none", // gölgeyi de kaldırdık
            backgroundColor: "transparent", // tamamen şeffaf
          }}
          elevation={0}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      {/* Sidebar */}
      <NewSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // kalan alanı kapla
          height: "100vh", // full height
          p: 2,
          backgroundColor: "#f5f5f5",
          overflowY: "auto", // içerik taşarsa scroll
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default NewDashboard;
