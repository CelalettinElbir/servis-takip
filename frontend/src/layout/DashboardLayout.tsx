// import React, { useContext, useState, useEffect } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { Box, AppBar, Toolbar, IconButton, Typography, CssBaseline } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import Sidebar from '../components/Sidebar';
// import { AuthContext } from '../context/AuthContext';

// const drawerWidth = 240;

// const DashboardLayout = () => {
//     const { logout, isAuthenticated, token } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [mobileOpen, setMobileOpen] = useState(false);

//     useEffect(() => {
//         if (!isAuthenticated && !token) {
//             navigate('/');
//         }
//     }, [isAuthenticated, token, navigate]);

//     const handleLogout = () => {
//         logout();
//         navigate('/');
//     };

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     return (
//         <Box sx={{ display: 'flex' }}>
//             <CssBaseline />
//             {/* Header */}

//             <Toolbar>
//                 <IconButton
//                     color="inherit"
//                     aria-label="open drawer"
//                     edge="start"
//                     onClick={handleDrawerToggle}
//                     sx={{ mr: 2, display: { md: 'none' } }}
//                 >
//                     <MenuIcon />
//                 </IconButton>
//             </Toolbar>

//             {/* Sidebar */}
//             <Sidebar
//                 mobileOpen={mobileOpen}
//                 handleDrawerToggle={handleDrawerToggle}
//                 onLogout={handleLogout}
//                 drawerWidth={drawerWidth}
//             />

//             {/* Main Content */}
//             <Box
//                 component="main"
//                 sx={{
//                     flexGrow: 1,
//                     p: 3,
//                     width: { md: `calc(100% - ${drawerWidth}px)` },
//                     mt: '64px', // AppBar height
//                 }}
//             >
//                 <Outlet />
//             </Box>
//         </Box>
//     );
// };

// export default DashboardLayout;
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  AppBar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
  const { logout, isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !token) {
      navigate("/login");
    }
  }, [isAuthenticated, token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          onLogout={handleLogout}
          drawerWidth={drawerWidth}
        />
      </Box>

      {/* Main Content: burada önemli olan minHeight: 0 ve display:flex */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // kalan alanı kapla
          height: "100vh", // full yükseklik
          minWidth: 0, // overflow için
          overflowY: "auto", // dikey kaydırma
          overflowX: "hidden",
          backgroundColor: "#f9fafb",
          p: 2,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
