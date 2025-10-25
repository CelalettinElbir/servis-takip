import React, { useContext, useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 240;

const DashboardLayout = () => {
    const { logout, isAuthenticated, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && !token) {
            navigate('/');
        }
    }, [isAuthenticated, token, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* Header */}

            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            {/* Sidebar */}
            <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                onLogout={handleLogout}
                drawerWidth={drawerWidth}
            />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px', // AppBar height
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;