import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import (AdbIcon, MenuItem, Tooltip, Button, AppBar, Box, Container, IconButton, Toolbar, Typography, Menu, MenuIcon, Avatar) from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Logout, AccountCircle } from '@mui/icons-material';
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // Clear all auth related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Navigate to sign-in page
    navigate('/sign-in', { replace: true });
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#ffffff", height: "60px" }}>
        <Box sx={{
          flexGrow: 0,
          padding: "10px 30px",
          display: 'flex',
          justifyContent: "flex-end",
          alignItems: "center"
        }}>


          <Box>
            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <ListItem button onClick={handleLogout}>
                
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Menu>
          </Box>
        </Box>
      </AppBar>
    </>
  );
};

export default Header;