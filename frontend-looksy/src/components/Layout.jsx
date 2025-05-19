import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import { useState } from 'react';
import DrawerSide from './DrawerSide';
import { Outlet } from 'react-router-dom';

function Layout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerToogle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={handleDrawerToogle} />
      <DrawerSide isDrawerOpen={isDrawerOpen} onMenuClick={handleDrawerToogle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Box sx={{ backgroundColor: '#F0F1EB', width: '100%', height: '100%', flexGrow: 1, pb: 5 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
