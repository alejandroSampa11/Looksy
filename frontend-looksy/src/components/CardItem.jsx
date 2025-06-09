import { Box, Typography } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import React from 'react'
import { toast } from 'react-toastify';

function CardItem({ imagen, nombre, precio, onClick}) {
    const handleCartClick = (e) => {
        e.stopPropagation();
        toast.success(`🛒 Agregado al carrito`)
    };

    return (
        <>
            <Box
                onClick={onClick}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '350px',
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: 'hidden',
                    cursor:'pointer',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
            >
                <Box
                    component="img"
                    sx={{
                        width: '250px',
                        height: '250px',
                        objectFit: 'contain',
                        padding: 2,
                    }}
                    src={`${import.meta.env.VITE_IMAGEN}${imagen}`}
                    alt={nombre}
                />
                <Box sx={{ p: 2, width: '100%', display:'flex', justifyContent:'space-between' }}>
                    <Box>
                        <Typography
                            sx={{ color: '#000000', }}
                            variant="h5"
                        >
                            {nombre}
                        </Typography>
                        <Typography
                            sx={{ color: '#000000' }}
                            variant="h6"
                        >
                            {`$ ${precio} MX`}
                        </Typography>
                    </Box>
                    <AddShoppingCartIcon 
                        onClick={handleCartClick}
                        sx={{
                            fontSize: 30, 
                            color: '#673430', 
                            cursor: 'pointer', 
                            '&:hover': {opacity: 0.7}
                        }}
                    />
                </Box>
            </Box>
        </>
    )
}

export default CardItem