import React from 'react';
import { Box } from '@mui/material';
import '../styles/MainLayout.css';
import Sidebar from '../Component/Sidebar/Sidebar.js';
import Header from '../Component/Header/Header.js';
import { Outlet } from 'react-router-dom';


const MainLayout = () => {
  return (
    <Box className="main-layout">
      <Sidebar />
      <Box className="content-wrapper">
        <Header/>
        <Box className="main-content">
          <Outlet/>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;