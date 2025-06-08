import React, { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    List,
    Drawer,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    IconButton,
    Chip,
    Collapse,
} from '@mui/material'
import {
    ArrowBackIos as ArrowBackIosIcon,
    Home as HomeIcon,
    Circle as RingIcon,
    FavoriteBorder as NecklaceIcon,
    Star as EarringIcon,
    Schedule as WatchIcon,
    Link as BraceletIcon,
    NewReleases as NewArrivalsIcon,
    AdminPanelSettings as AdminIcon,
    Person as PersonIcon,
    ExitToApp as LogoutIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import apiAxios from '../config/cienteAxios'
import CategoryList from './CategoryList'
const drawerWidth = 320

function DrawerSide({ onMenuClick, isDrawerOpen }) {
    const navigate = useNavigate()
    const { user, isAuthenticated, hasRole } = useAuth();
    const [categories, setCategories] = useState([])

    const handleNavigation = (path) => {
        navigate(path)
        onMenuClick()
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiAxios.get('/category/tree');
                const data = response.data.data;s
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        }
        fetchCategories()
    }, [])

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
                    zIndex: (theme) => theme.zIndex.appBar + 100,
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
                    borderRight: 'none',
                    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2.5,
                    background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                    color: 'white',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
                    }
                }}
            >
                <IconButton
                    onClick={onMenuClick}
                    sx={{
                        color: 'white',
                        padding: 1,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateX(-3px)'
                        }
                    }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography
                    variant="h5"
                    sx={{
                        ml: 2,
                        fontWeight: 'bold',
                        letterSpacing: 1
                    }}
                >
                    MARUA
                </Typography>
            </Box>

            {isAuthenticated && user && (
                <Box
                    sx={{
                        p: 2.5,
                        backgroundColor: '#f5f5f5',
                        borderBottom: '1px solid #e0e0e0'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon sx={{ color: '#673430', mr: 1.5 }} />
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                color: '#673430'
                            }}
                        >
                            {user.username || 'User'}
                        </Typography>
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#666',
                            fontSize: '0.85rem'
                        }}
                    >
                        {user.email}
                    </Typography>
                </Box>
            )}

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Typography
                    variant="overline"
                    sx={{
                        px: 2.5,
                        pt: 2,
                        pb: 1,
                        color: '#666',
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                    }}
                >
                    CATEGORIES
                </Typography>
                <CategoryList categories={categories} handleNavigation={handleNavigation}/>
                {hasRole('admin') && (
                    <>
                        <Divider sx={{ my: 2, mx: 2 }} />
                        <Typography
                            variant="overline"
                            sx={{
                                px: 2.5,
                                pb: 1,
                                color: '#666',
                                fontWeight: 'bold',
                                fontSize: '0.75rem'
                            }}
                        >
                            ADMINISTRATION
                        </Typography>
                        <List sx={{ px: 1 }}>
                            <ListItem
                                button
                                onClick={() => handleNavigation('/admin')}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    mx: 1,
                                    transition: 'all 0.2s ease-in-out',
                                    backgroundColor: 'rgba(103, 52, 48, 0.05)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(103, 52, 48, 0.12)',
                                        transform: 'translateX(8px)',
                                        boxShadow: '2px 2px 8px rgba(103, 52, 48, 0.1)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: '#673430', minWidth: 40 }}>
                                    <AdminIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Admin Panel"
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontWeight: 600,
                                            color: '#673430'
                                        }
                                    }}
                                />
                            </ListItem>
                        </List>
                    </>
                )}
            </Box>

        </Drawer>
    )
}

export default DrawerSide