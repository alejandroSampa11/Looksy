import { Box, Toolbar, Container } from '@mui/material'
import Header from './Header';
import { useState } from 'react';
import DrawerSide from './DrawerSide';

function Layout({ children }) {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerToogle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  }

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
        <Box sx={{ backgroundColor: '#F0F1EB', width: '100%', p: 3, height: '100%', flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout