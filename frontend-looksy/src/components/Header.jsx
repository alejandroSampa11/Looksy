import React, { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    InputAdornment,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material'
import {
    Menu as MenuIcon,
    ShoppingCart as ShoppingCartIcon,
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    FavoriteBorder as FavoriteIcon,
    Close as CloseIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSelector, useDispatch } from 'react-redux';
import { setSearchFilter } from '../redux/slices/filterSlice'

function Header({ onMenuClick, cartItemCount = 0 }) {
    const dispatch = useDispatch();
     const { userInfo, isAdmin } = useSelector(state => state.user);
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null)
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const handleProfileMenuOpen = (event) => {
        setProfileMenuAnchor(event.currentTarget)
    }

    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null)
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Sesión cerrada correctamente');
        navigate('/');
        handleProfileMenuClose();
    }

    const handleSearch = async () => {
        if (searchValue.trim()) {
            dispatch(setSearchFilter(searchValue.trim()))
        }
    }

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    const drawerContent = (
        <Box sx={{ width: 280, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
                <Typography variant="h6" sx={{ color: '#673430', fontWeight: 'bold' }}>
                    MARUA
                </Typography>
                <IconButton onClick={() => setMobileDrawerOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <PersonIcon sx={{ color: '#673430' }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <FavoriteIcon sx={{ color: '#673430' }} />
                    </ListItemIcon>
                    <ListItemText primary="Wishlist" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <SettingsIcon sx={{ color: '#673430' }} />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
                <Divider />
                <ListItem button onClick={() => { }}>
                    <ListItemIcon>
                        <LogoutIcon sx={{ color: '#673430' }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    )

    if (isMobile) {
        return (
            <>
                <AppBar position="fixed" sx={{ backgroundColor: '#FFFFFF', boxShadow: 2 }}>
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                onClick={() => setMobileDrawerOpen(true)}
                                sx={{ color: '#673430', mr: 1 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                variant="h5"
                                sx={{ color: '#673430', fontWeight: 'bold', letterSpacing: 1 }}
                            >
                                MARUA
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton sx={{ color: '#673430' }}>
                                <SearchIcon />
                            </IconButton>
                            <IconButton sx={{ color: '#673430' }}>
                                <Badge badgeContent={cartItemCount} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                sx={{ color: '#673430' }}
                            >
                                <AccountCircleOutlinedIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Drawer
                    anchor="left"
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                >
                    {drawerContent}
                </Drawer>
            </>
        )
    }

    return (
        <>
            <AppBar position="fixed" sx={{ backgroundColor: '#FFFFFF', boxShadow: 2 }}>
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72, px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            onClick={onMenuClick}
                            sx={{
                                color: '#673430',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: 'rgba(103, 52, 48, 0.1)',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <MenuIcon sx={{ fontSize: 28 }} />
                        </IconButton>
                        <Typography
                            variant="h4"
                            sx={{
                                color: '#673430',
                                fontWeight: 'bold',
                                letterSpacing: 2,
                                cursor: 'pointer',
                                transition: 'color 0.2s ease-in-out',
                                '&:hover': {
                                    color: '#4a2521'
                                }
                            }}
                        >
                            MARUA
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', width: '45%', maxWidth: 600 }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search products, brands, categories..."
                            variant="outlined"
                            value={searchValue}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchValue(value);
                                dispatch(setSearchFilter(value.trim()))
                            }}
                            onKeyPress={handleSearchKeyPress}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#673430' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: 2,
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#f0f1f2',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#ffffff',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#673430',
                                            borderWidth: 2,
                                        }
                                    }
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            sx={{
                                color: '#673430',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: 'rgba(103, 52, 48, 0.1)',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <NotificationsIcon sx={{ fontSize: 26 }} />
                        </IconButton>

                        <IconButton
                            onClick={handleProfileMenuOpen}
                            sx={{
                                color: '#673430',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: 'rgba(103, 52, 48, 0.1)',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <AccountCircleOutlinedIcon sx={{ fontSize: 26 }} />
                        </IconButton>

                        {user && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#673430',
                                    ml: 1,
                                    display: { xs: 'none', lg: 'block' }
                                }}
                            >
                                Welcome, {user.firstName || 'User'}
                            </Typography>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>


            <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={handleProfileMenuClose}
            >
                {isAuthenticated ?
                    <>
                        <MenuItem onClick={handleProfileMenuClose}>
                            <PersonIcon sx={{ mr: 2, color: '#673430' }} />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleProfileMenuClose}>
                            <FavoriteIcon sx={{ mr: 2, color: '#673430' }} />
                            Wishlist
                        </MenuItem>
                        <MenuItem onClick={handleProfileMenuClose}>
                            <SettingsIcon sx={{ mr: 2, color: '#673430' }} />
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 2, color: '#673430' }} />
                            Logout
                        </MenuItem>
                    </>
                    :
                    <>
                        <MenuItem onClick={() => { navigate('/login') }}>
                            <PersonIcon sx={{ mr: 2, color: '#673430' }} />
                            Sign In
                        </MenuItem>
                        <MenuItem onClick={() => { navigate('/sign-up') }}>
                            <FavoriteIcon sx={{ mr: 2, color: '#673430' }} />
                            Sign Up
                        </MenuItem>
                    </>
                }

            </Menu>
        </>
    )
}

export default Header