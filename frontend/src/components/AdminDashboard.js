import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Button,
} from '@mui/material';
import { People, Business, Security, Announcement } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const AdminDashboard = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            管理后台
          </Typography>
          <Button color="inherit" onClick={logout}>
            退出
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/users"
                selected={location.pathname.startsWith('/admin/users')}
              >
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="用户管理" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/departments"
                selected={location.pathname.startsWith('/admin/departments')}
              >
                <ListItemIcon>
                  <Business />
                </ListItemIcon>
                <ListItemText primary="部门管理" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/roles"
                selected={location.pathname.startsWith('/admin/roles')}
              >
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="角色管理" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/announcements"
                selected={location.pathname.startsWith('/admin/announcements')}
              >
                <ListItemIcon>
                  <Announcement />
                </ListItemIcon>
                <ListItemText primary="公告管理" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: `${drawerWidth}px` }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
