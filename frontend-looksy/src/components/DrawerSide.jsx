
import { Box, Typography, List, Drawer, ListItem, ListItemText } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const drawerWidth = 400;
const menuItems = [
  { id: 1, text: "Inicio" },
  { id: 2, text: "Rings" },
  { id: 3, text: "Necklaces" },
  { id: 4, text: "Earrings" },
  { id: 5, text: "Watches" },
  { id: 6, text: "Bracelets" },
  { id: 7, text: "New Arrivals" }
];

function DrawerSide({ onMenuClick, isDrawerOpen }) {
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
            <ListItem button key={item.id}>
              <ListItemText
                primary={item.text}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default DrawerSide