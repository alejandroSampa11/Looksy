
import { Box, Typography, List, Drawer, ListItem, ListItemText } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 400;
const menuItems = [
  { id: 1, text: "Inicio", path: "/" },
  { id: 2, text: "Rings", path: "/rings" },
  { id: 3, text: "Necklaces", path: "/necklaces" },
  { id: 4, text: "Earrings", path: "/earrings" },
  { id: 5, text: "Watches", path: "/watches" },
  { id: 6, text: "Bracelets", path: "/bracelets" },
  { id: 7, text: "New Arrivals", path: "/new-arrivals" }
];

function DrawerSide({ onMenuClick, isDrawerOpen }) {
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
    onMenuClick();
  };
  return (
    <Drawer
      variant="temporary"
      open={isDrawerOpen}
      onClose={onMenuClick}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          zIndex: (theme) => theme.zIndex.appBar + 100
        },
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <ArrowBackIosIcon
          onClick={onMenuClick}
          sx={{
            fontSize: 30,
            cursor: 'pointer',
            color: '#673430',
            '&:hover': {
              opacity: 0.7
            }
          }}
        />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Menú Principal
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.id}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default DrawerSide