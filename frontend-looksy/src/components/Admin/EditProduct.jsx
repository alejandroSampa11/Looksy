import React from 'react'
import apiAxios from '../../config/cienteAxios';
import { toast } from 'react-toastify';
import {
    Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Select, MenuItem, FormControl, InputLabel, Grid, Avatar, Card, CardContent, Divider, Chip, Stack, alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function EditProduct(props) {
    const { selectedProduct, products, getStockColor, setSelectedProduct,
        setFormData, getCategoryIcon, resetForm, formData, getCategoryNumber,
        fetchProducts, handleInputChange, categoryOptions } = props;

    const handleSelectProductToEdit = (product) => {
        console.log(product);
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

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const itemData = {
                id: selectedProduct.id,
                nombre: formData.name,
                categoria: getCategoryNumber(formData.category),
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
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
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

                        <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, transparent, #667eea, transparent)' }} />

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
                                                    src={product.imageUrl ? `http://localhost:3000${product.imageUrl}` : '/default-placeholder.jpg'}
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
                                                            <span style={{ marginRight: 4 }}>{getCategoryIcon(product.category)}</span>
                                                            {product.category}
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
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        '&:hover': {
                                                            transform: 'scale(1.1)',
                                                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                    src={selectedProduct.imageUrl}
                                    variant="rounded"
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        border: '3px solid white',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                    }}
                                />
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                                        Editing: {selectedProduct.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Update product information
                                    </Typography>
                                </Box>
                            </Stack>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setSelectedProduct(null);
                                    resetForm();
                                }}
                                sx={{
                                    borderRadius: 2,
                                    borderColor: '#667eea',
                                    color: '#667eea',
                                    '&:hover': {
                                        backgroundColor: alpha('#667eea', 0.1),
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Back to List
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, transparent, #667eea, transparent)' }} />

                        <form onSubmit={handleUpdateProduct}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Product Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
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
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                                                }
                                            }}
                                        >
                                            {categoryOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <span style={{ marginRight: 8 }}>{getCategoryIcon(option.value)}</span>
                                                        {option.label}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
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
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
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
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Image URL"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                                                }
                                            }
                                        }}
                                    />
                                    {formData.imageUrl && (
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                            <Avatar
                                                src={formData.imageUrl}
                                                variant="rounded"
                                                sx={{
                                                    width: 160,
                                                    height: 160,
                                                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                                    border: '4px solid white'
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setSelectedProduct(null);
                                            resetForm();
                                        }}
                                        sx={{
                                            borderRadius: 2,
                                            borderColor: '#667eea',
                                            color: '#667eea',
                                            '&:hover': {
                                                backgroundColor: alpha('#667eea', 0.1),
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </>
                )}
            </CardContent>
        </Card>
    )
}


export default EditProduct