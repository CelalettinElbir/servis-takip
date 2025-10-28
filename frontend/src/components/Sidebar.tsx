// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Typography } from '@mui/material';
// import Drawer from '@mui/material/Drawer';
// import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Toolbar from '@mui/material/Toolbar';
// import Divider from '@mui/material/Divider';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import BuildIcon from '@mui/icons-material/Build';
// import LogoutIcon from '@mui/icons-material/Logout';
// import PeopleIcon from '@mui/icons-material/People';
// import SettingsIcon from '@mui/icons-material/Settings';

// interface SidebarProps {
//   mobileOpen: boolean;
//   handleDrawerToggle: () => void;
//   onLogout: () => void;
//   drawerWidth?: number;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   mobileOpen,
//   handleDrawerToggle,
//   onLogout,
//   drawerWidth = 240,
// }) => {
//   const navigate = useNavigate();

//   const drawer = (
//     <div>
//       <Toolbar sx={{ px: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32 }} />
//           <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//             Netline Yazılım
//           </Typography>
//         </Box>
//       </Toolbar>
//       <Divider />
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => { navigate('/dashboard'); handleDrawerToggle(); }}>
//             <ListItemIcon>
//               <DashboardIcon />
//             </ListItemIcon>
//             <ListItemText primary="Dashboard" />
//           </ListItemButton>
//         </ListItem>

//         <ListItem disablePadding>
//           <ListItemButton onClick={() => { navigate('/Services'); handleDrawerToggle(); }}>
//             <ListItemIcon>
//               <BuildIcon />
//             </ListItemIcon>
//             <ListItemText primary="Servis Kayıtları" />
//           </ListItemButton>
//         </ListItem>

//         <ListItem disablePadding>
//           <ListItemButton onClick={() => { navigate('/kullanicilar'); handleDrawerToggle(); }}>
//             <ListItemIcon>
//               <PeopleIcon />
//             </ListItemIcon>
//             <ListItemText primary="Kullanıcılar" />
//           </ListItemButton>
//         </ListItem>

//         <ListItem disablePadding>
//           <ListItemButton onClick={() => { navigate('/ayarlar'); handleDrawerToggle(); }}>
//             <ListItemIcon>
//               <SettingsIcon />
//             </ListItemIcon>
//             <ListItemText primary="Ayarlar" />
//           </ListItemButton>
//         </ListItem>
//       </List>

//       <Box sx={{ flexGrow: 1 }} />
//       <Divider />
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton onClick={onLogout}>
//             <ListItemIcon>
//               <LogoutIcon />
//             </ListItemIcon>
//             <ListItemText primary="Çıkış Yap" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </div>
//   );

//   return (
//     <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="mailbox folders">
//       {/* Mobile drawer */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{ keepMounted: true }} // Better open performance on mobile.
//         sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
//       >
//         {drawer}
//       </Drawer>

//       {/* Permanent drawer for md+ */}
//       <Drawer
//         variant="permanent"
//         sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
//         open
//       >
//         {drawer}
//       </Drawer>
//     </Box>
//   );
// };

// export default Sidebar;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Box, Toolbar, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onLogout: () => void;
  drawerWidth?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle, onLogout, drawerWidth = 240 }) => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Servis Kayıtları', icon: <BuildIcon />, path: '/services' },
    { text: 'Kullanıcılar', icon: <PeopleIcon />, path: '/kullanicilar' },
    { text: 'Ayarlar', icon: <SettingsIcon />, path: '/ayarlar' },
  ];

  const drawerContent = (
    <div>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Netline Yazılım
        </Typography>
      </Toolbar>
      <Divider />
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

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Çıkış Yap" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="sidebar">
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
