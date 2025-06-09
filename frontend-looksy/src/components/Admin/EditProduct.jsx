import React, { useEffect, useState } from 'react'
import apiAxios from '../../config/cienteAxios';
import { toast } from 'react-toastify';
import {
    Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Select, MenuItem, FormControl, InputLabel, Grid, Avatar, Card, CardContent, Divider, Chip, Stack, alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function EditProduct(props) {
    const { selectedProduct, products, getStockColor, setSelectedProduct,
        setFormData, resetForm, formData,
        fetchProducts, handleInputChange } = props;

    const [categories, setCategories] = useState({});

    const handleSelectProductToEdit = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description || '',
            imageUrl: product.imageUrl || ''
        });
    };
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

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const itemData = {
                id: selectedProduct.id,
                nombre: formData.name,
                categoria: formData.category,
                precio: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                descripcion: formData.description,
                urlImage: formData.imageUrl
            };

            const response = await apiAxios.put('/item', itemData);
            if (response.status === 200) {
                fetchProducts();
                setSelectedProduct(null);
                resetForm();
                toast.success('Producto actualizado exitosamente!');
            } else {
                throw new Error(response.data.message || 'Error updating product');
            }
        } catch (error) {
            toast.error(`Error updating product: ${error.message}`);
        }
    };


    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(103, 52, 48, 0.2)',
                boxShadow: '0 8px 32px rgba(103, 52, 48, 0.15)'
            }}
        >
            <CardContent sx={{ p: 4 }}>
                {!selectedProduct ? (
                    <>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <Box sx={{
                                p: 2,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <EditIcon sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#673430' }}>
                                    Select Product to Edit
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Choose a product from the list below to modify
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, transparent, #673430, transparent)' }} />

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
                                                backgroundColor: alpha('#673430', 0.05),
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
                                                    onClick={() => handleSelectProductToEdit(product)}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                                                        color: 'white',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)',
                                                            boxShadow: '0 4px 20px rgba(103, 52, 48, 0.4)'
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                ) : (
                    <>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <Box sx={{
                                p: 2,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <EditIcon sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#673430' }}>
                                    Edit Product
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Update product information for {selectedProduct.name}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, transparent, #673430, transparent)' }} />

                        <form onSubmit={handleUpdateProduct}>
                            <Grid container spacing={3}>
                                <FormControl fullWidth>
                                    <TextField
                                        width={'80%'}
                                        label="Product Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(103, 52, 48, 0.15)'
                                                },
                                                '&.Mui-focused': {
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#673430'
                                                    }
                                                }
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#673430'
                                            }
                                        }}
                                    />
                                </FormControl>

                                {/* Category Select */}
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        label="Category"
                                        sx={{
                                            borderRadius: 2,
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(103, 52, 48, 0.15)'
                                            },
                                            '&.Mui-focused': {
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#673430'
                                                }
                                            }
                                        }}
                                    >
                                        {Object.entries(categories).map(([categoryId, categoryName]) => (
                                            <MenuItem key={categoryId} value={categoryId}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {categoryName}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <Box display={'flex'} flexDirection={'row'} gap={4}>
                                        <TextField
                                            fullWidth
                                            label="Price"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            InputProps={{
                                                startAdornment: '$',
                                                inputProps: { min: 0, step: 0.01 }
                                            }}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        boxShadow: '0 4px 12px rgba(103, 52, 48, 0.15)'
                                                    },
                                                    '&.Mui-focused': {
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#673430'
                                                        }
                                                    }
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#673430'
                                                }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Stock Quantity"
                                            name="stock"
                                            type="number"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            required
                                            InputProps={{ inputProps: { min: 0 } }}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        boxShadow: '0 4px 12px rgba(103, 52, 48, 0.15)'
                                                    },
                                                    '&.Mui-focused': {
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#673430'
                                                        }
                                                    }
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#673430'
                                                }
                                            }}
                                        />
                                    </Box>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Product Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(103, 52, 48, 0.15)'
                                            },
                                            '&.Mui-focused': {
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#673430'
                                                }
                                            }
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#673430'
                                        }
                                    }}
                                />

                                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', width: '100%' }}>
                                    {/* Image URL Input */}
                                    <TextField
                                        disabled
                                        fullWidth
                                        label="Image URL"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        variant="outlined"
                                        sx={{
                                            flex: 1,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(103, 52, 48, 0.15)'
                                                },
                                                '&.Mui-focused': {
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#673430'
                                                    }
                                                }
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#673430'
                                            }
                                        }}
                                    />


                                    {/* Image Preview */}
                                    {formData.imageUrl && (
                                        <Avatar
                                            src={`${import.meta.env.VITE_IMAGEN}${formData.imageUrl}`}
                                            variant="rounded"
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                boxShadow: '0 4px 16px rgba(103, 52, 48, 0.25)',
                                                border: '2px solid white'
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    width: '100%',
                                    gap: 3,
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    borderTop: '1px solid rgba(103, 52, 48, 0.1)'
                                }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setSelectedProduct(null);
                                            resetForm();
                                        }}
                                        sx={{
                                            borderRadius: 3,
                                            color: '#673430',
                                            borderColor: '#673430',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            minWidth: '120px',
                                            border: '2px solid #673430',
                                            '&:hover': {
                                                backgroundColor: 'rgba(103, 52, 48, 0.08)',
                                                borderColor: '#8B4513',
                                                color: '#8B4513',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(103, 52, 48, 0.2)'
                                            },
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            px: 6,
                                            py: 2,
                                            borderRadius: 3,
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            minWidth: '160px',
                                            background: 'linear-gradient(135deg, #673430 0%, #8B4513 50%, #A0522D 100%)',
                                            boxShadow: '0 8px 25px rgba(103, 52, 48, 0.4)',
                                            border: 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                                transition: 'left 0.5s'
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 12px 35px rgba(103, 52, 48, 0.6)',
                                                background: 'linear-gradient(135deg, #5a2b28 0%, #7a3e11 50%, #8B4513 100%)',
                                                '&::before': {
                                                    left: '100%'
                                                }
                                            },
                                            '&:active': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 8px 25px rgba(103, 52, 48, 0.5)'
                                            },
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        💾 Save Changes
                                    </Button>
                                </Box>
                            </Grid>
                        </form>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default EditProduct