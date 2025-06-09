import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import apiAxios from '../../config/cienteAxios';
import { toast } from 'react-toastify';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, IconButton, Avatar, Card, CardContent, Divider, Chip, Stack, alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';


function DeleteProduct(props) {
    const { products, getStockColor, fetchProducts } = props;
    const [categories, setCategories] = useState({});

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

    // Función para obtener el nombre de una categoría específica
    const getCategoryName = (categoryId) => {
        return categories[categoryId] || 'Unknown Category';
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDeleteProduct = async (productId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await apiAxios.delete('/item', { data: { id: productId } });
                toast.success('Producto eliminado exitosamente!');
                fetchProducts();
            }
        });

    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <InventoryIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                            Manage Inventory
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Review and manage your product inventory. Delete products that are no longer available.
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, transparent, #f093fb, transparent)' }} />

                <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                                '& .MuiTableCell-head': {
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.95rem'
                                }
                            }}>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id} sx={{
                                    '&:hover': {
                                        backgroundColor: alpha('#f093fb', 0.05),
                                        transform: 'scale(1.01)',
                                        transition: 'all 0.2s ease'
                                    }
                                }}>
                                    <TableCell>
                                        <Avatar
                                            src={product.imageUrl ? `${import.meta.env.VITE_IMAGEN}${product.imageUrl}` : '/default-placeholder.jpg'}
                                            variant="rounded"
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                border: '2px solid #f0f0f0',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 600 }}>
                                            {product.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {getCategoryName(product.category)}
                                                </Box>
                                            }
                                            size="small"
                                            sx={{
                                                background: 'linear-gradient(135deg, #644340 0%, #64423f 100%)',
                                                color: 'white',
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 600, color: '#2d3748' }}>
                                            ${product.price.toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.stock}
                                            size="small"
                                            color={getStockColor(product.stock)}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteProduct(product.id)}
                                            sx={{
                                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                                color: 'white',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    boxShadow: '0 4px 20px rgba(238, 90, 82, 0.4)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}

export default DeleteProduct