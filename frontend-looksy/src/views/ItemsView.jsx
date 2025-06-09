import { Box, Typography, Button, IconButton, Chip, Grid, Card, CardContent, Fade, Zoom, Badge, CardMedia, CardActions } from "@mui/material"
import { useEffect, useState } from "react"
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import InventoryIcon from '@mui/icons-material/Inventory'
import { useNavigate, useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import apiAxios from "../config/cienteAxios"
import CardItem from "../components/CardItem"

function ItemDetailView() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)
    const [categories, setCategories] = useState({})
    const [imageLoaded, setImageLoaded] = useState(false)
    const [relatedItems, setRelatedItems] = useState([])

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setIsLoading(true)
                const response = await apiAxios.get(`/item/${id}`)
                setItem(response.data.data)
                if (response.data.data.categoria) {
                    fetchRelatedItems(response.data.data.categoria)
                }
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error('Error al cargar el producto')
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchItem()
        }
    }, [id])

    const fetchCategories = async () => {
        try {
            const response = await apiAxios.get('/category/roots');
            const categoryMap = {};
            response.data.data.forEach(category => {
                categoryMap[category._id] = category.nombre;
            });
            setCategories(categoryMap);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/item/${productId}`)
    }

    const fetchRelatedItems = async (categoryId) => {
        try {
            const response = await apiAxios.get(`/item/category/${categoryId}`)
            const filtered = response.data.data.filter(relatedItem => relatedItem._id !== id)
            const shuffled = filtered.sort(() => 0.5 - Math.random())
        
        setRelatedItems(shuffled.slice(0, 5))
        } catch (error) {
            console.error('Error fetching related items:', error)
            toast.error('Error al cargar productos relacionados')
        }
    }

    const getCategoryName = (category) => {
        if (category && category.nombre) {
            return category.nombre;
        }
        return categories[category] || 'Categoría general';
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite)
        if (!isFavorite) {
            toast.success('💖 Agregado a favoritos')
        } else {
            toast.success('💔 Eliminado de favoritos')
        }
    }

    const handleAddToCart = () => {
        toast.success(`🛒 ${item.nombre} agregado al carrito`)
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    if (isLoading) {
        return (
            <Box sx={{
                width: '100%',
                height: '100vh',
                background: 'linear-gradient(135deg, #F0F1EB 0%, #E8E9E3 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Card sx={{ padding: 4, borderRadius: 4, boxShadow: 6 }}>
                    <Typography variant="h6" sx={{ color: '#673430', textAlign: 'center' }}>
                        ⏳ Cargando producto...
                    </Typography>
                </Card>
            </Box>
        )
    }

    if (!item) {
        return (
            <Box sx={{
                width: '100%',
                height: '100vh',
                background: 'linear-gradient(135deg, #F0F1EB 0%, #E8E9E3 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Card sx={{ padding: 4, borderRadius: 4, boxShadow: 6 }}>
                    <Typography variant="h6" sx={{ color: '#673430', textAlign: 'center' }}>
                        😕 No se encontró el producto
                    </Typography>
                </Card>
            </Box>
        )
    }

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F0F1EB 0%, #E8E9E3 100%)',
            padding: { xs: 2, md: 4 }
        }}>
            <Fade in={true} timeout={800}>
                <Box>
                    {/* Back Button */}
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleGoBack}
                        sx={{
                            color: '#673430',
                            mb: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            padding: '12px 20px',
                            border: '2px solid transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#673430',
                                color: 'white',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(103, 52, 48, 0.3)'
                            }
                        }}
                    >
                        Volver
                    </Button>

                    {/* Item Detail Card */}
                    <Card sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 4,
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        width: '100%'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            height: '100%'
                        }}>
                            {/* Image Section */}
                            <Box sx={{
                                flex: { xs: 'none', md: '1 1 60%' },
                                position: 'relative',
                                overflow: 'hidden',
                                height: { xs: '400px', md: '700px' },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5'
                            }}>
                                <Zoom in={imageLoaded} timeout={600}>
                                    <Box
                                        component="img"
                                        src={item.imageUrl ? `http://localhost:3000${item.imageUrl}` : '/placeholder-image.jpg'}
                                        alt={item.nombre}
                                        onLoad={() => setImageLoaded(true)}
                                        sx={{
                                            maxWidth: '90%',
                                            maxHeight: '90%',
                                            width: 'auto',
                                            height: 'auto',
                                            objectFit: 'contain',
                                            display: 'block',
                                            margin: '0 auto',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    />
                                </Zoom>

                                {/* Favorite Badge */}
                                <IconButton
                                    onClick={toggleFavorite}
                                    sx={{
                                        position: 'absolute',
                                        top: 20,
                                        right: 20,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        color: isFavorite ? '#e91e63' : '#673430',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            transform: 'scale(1.1)',
                                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                                        }
                                    }}
                                >
                                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                            </Box>

                            {/* Details Section */}
                            <Box sx={{
                                flex: { xs: 'none', md: '1 1 40%' },
                                padding: { xs: 3, md: 4 },
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: { xs: 'auto', md: '700px' }
                            }}>
                                <Fade in={true} timeout={1000}>
                                    <Box>
                                        {/* Category Chip */}
                                        {item.categoria && (
                                            <Chip
                                                icon={<LocalOfferIcon />}
                                                label={getCategoryName(item.categoria)}
                                                sx={{
                                                    background: 'linear-gradient(45deg, #673430, #8B4513)',
                                                    color: 'white',
                                                    mb: 3,
                                                    fontSize: '0.9rem',
                                                    height: '40px',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 4px 12px rgba(103, 52, 48, 0.3)',
                                                    '& .MuiChip-icon': {
                                                        color: 'white'
                                                    }
                                                }}
                                            />
                                        )}

                                        {/* Product Name */}
                                        <Typography variant="h3" sx={{
                                            color: '#673430',
                                            fontWeight: 'bold',
                                            mb: 2,
                                            fontSize: { xs: '2rem', md: '2.5rem' },
                                            lineHeight: 1.2,
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            {item.nombre}
                                        </Typography>

                                        {/* Price */}
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="h4" sx={{
                                                background: 'linear-gradient(45deg, #673430, #8B4513)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                fontWeight: 'bold',
                                                fontSize: { xs: '2rem', md: '2.5rem' }
                                            }}>
                                                ${item.precio} MX
                                            </Typography>
                                        </Box>

                                        {/* Description */}
                                        <Card sx={{
                                            mb: 3,
                                            backgroundColor: 'rgba(240, 241, 235, 0.5)',
                                            border: '1px solid rgba(103, 52, 48, 0.1)',
                                            borderRadius: 3
                                        }}>
                                            <CardContent>
                                                <Typography variant="body1" sx={{
                                                    lineHeight: 1.8,
                                                    fontSize: '1.1rem',
                                                    color: 'text.primary'
                                                }}>
                                                    {item.descripcion}
                                                </Typography>
                                            </CardContent>
                                        </Card>

                                        {/* Stock Info */}
                                        {item.stock && (
                                            <Card sx={{
                                                mb: 4,
                                                backgroundColor: item.stock > 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                                border: `1px solid ${item.stock > 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                                                borderRadius: 3
                                            }}>
                                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <InventoryIcon sx={{
                                                        color: item.stock > 0 ? 'success.main' : 'error.main'
                                                    }} />
                                                    <Typography variant="body1" sx={{
                                                        color: item.stock > 0 ? 'success.main' : 'error.main',
                                                        fontSize: '1.1rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {item.stock > 0 ? `Stock disponible: ${item.stock}` : 'Sin stock'}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Action Buttons */}
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<ShoppingCartIcon />}
                                                onClick={handleAddToCart}
                                                disabled={item.stock === 0}
                                                sx={{
                                                    background: 'linear-gradient(45deg, #673430, #8B4513)',
                                                    flex: 1,
                                                    height: '60px',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold',
                                                    borderRadius: 3,
                                                    boxShadow: '0 8px 20px rgba(103, 52, 48, 0.3)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #8B4513, #673430)',
                                                        transform: 'translateY(-3px)',
                                                        boxShadow: '0 12px 25px rgba(103, 52, 48, 0.4)'
                                                    },
                                                    '&:disabled': {
                                                        background: 'linear-gradient(45deg, #ccc, #999)',
                                                        transform: 'none'
                                                    }
                                                }}
                                            >
                                                {item.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Fade>
                            </Box>
                        </Box>
                    </Card>

                    {relatedItems.length > 0 && (
                        <Box sx={{
                            width: '100%',
                            maxWidth: '100%',
                            margin: '32px 0 0 0',
                            padding: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <Typography variant="h4" sx={{
                                color: '#673430',
                                fontWeight: 'bold',
                                mb: 3,
                                textAlign: 'center',
                                fontSize: { xs: '1.8rem', md: '2.2rem' }
                            }}>
                                Productos Relacionados
                            </Typography>

                            <Grid container spacing={3} sx={{
                                width: '100%',
                                margin: 0,
                                justifyContent: 'center'
                            }}>
                                {relatedItems.map((relatedItem, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={relatedItem._id}>
                                        <Fade in={true} timeout={800 + index * 200}>
                                            <Box>
                                                <CardItem
                                                    imagen={relatedItem.imageUrl}
                                                    nombre={relatedItem.nombre}
                                                    precio={relatedItem.precio}
                                                    onClick={() => handleProductClick(relatedItem._id)}
                                                />
                                            </Box>
                                        </Fade>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Fade>
        </Box>
    )
}

export default ItemDetailView