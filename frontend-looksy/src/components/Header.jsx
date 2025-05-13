import { AppBar, Toolbar, Box, Typography, TextField, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

function Header({ onMenuClick }) {
    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#FFFFFF' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MenuIcon onClick={onMenuClick} sx={{
                        fontSize: 30, color: '#673430', cursor: 'pointer', '&:hover': {
                            opacity: 0.7
                        }
                    }} />
                    <Typography sx={{ color: '#000000', marginLeft: 2 }} variant="h4">
                        MARUA
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '40%' }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Search products..."
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f5f5f5',
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#673430',
                            '&:hover': {
                                backgroundColor: '#4a2521'
                            }
                        }}
                    >
                        Search
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ShoppingCartIcon sx={{cursor: 'pointer', fontSize: 30, color: '#673430', '&:hover': {opacity: 0.7}}} />
                    <AccountCircleOutlinedIcon sx={{cursor: 'pointer',fontSize: 30, color: '#673430', '&:hover': {opacity: 0.7}}} />
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header