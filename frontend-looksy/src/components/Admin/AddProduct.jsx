import React from 'react'
import { toast } from 'react-toastify';
import apiAxios from '../../config/cienteAxios';
import AddIcon from '@mui/icons-material/Add';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Avatar,
    Card,
    CardContent,
    Divider,
    Stack,
    TextField,
    Button
} from '@mui/material';

function AddProduct(props) {
    const { resetForm, formData, handleInputChange, categoryOptions, getCategoryNumber, getCategoryIcon } = props;

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append('nombre', formData.name);
            form.append('categoria', getCategoryNumber(formData.category));
            form.append('precio', parseFloat(formData.price));
            form.append('stock', parseInt(formData.stock));
            form.append('descripcion', formData.description);
            form.append('image', formData.imageUrl);

            const response = await apiAxios.post('/item', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Error al crear el producto');
            }

            resetForm();
            toast.success('Producto creado exitosamente!');
        } catch (error) {
            toast.error(`Error al crear el producto: ${error.message}`);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleInputChange({ target: { name: 'imageUrl', value: file } });
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                mb: 4,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(103, 52, 48, 0.2)',
                boxShadow: '0 8px 32px rgba(103, 52, 48, 0.15)'
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
                        <AddIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#673430' }}>
                            Add New Product
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create a new jewelry piece for your collection
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, transparent, #673430, transparent)' }} />

                <form onSubmit={handleCreateProduct}>
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
                        <FormControl fullWidth>
                            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                                <Box flex={1} display="flex" gap={1}>
                                    <TextField
                                        fullWidth
                                        label="Image File"
                                        name="imageUrl"
                                        value={formData.imageUrl?.name || ''}
                                        disabled
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            },
                                            '& .MuiInputLabel-root.Mui-disabled': {
                                                color: '#673430'
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            borderRadius: 2,
                                            color: '#673430',
                                            borderColor: '#673430',
                                            '&:hover': {
                                                backgroundColor: 'rgba(103, 52, 48, 0.08)',
                                                borderColor: '#673430'
                                            }
                                        }}
                                    >
                                        Choose File
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </Box>

                                <Box mt={3} display="flex" justifyContent="center">
                                    <Avatar
                                        src={
                                            formData.imageUrl
                                                ? URL.createObjectURL(formData.imageUrl)
                                                : ''
                                        }
                                        variant="rounded"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            boxShadow: '0 8px 32px rgba(103, 52, 48, 0.25)',
                                            border: '4px solid white'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </FormControl>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            sx={{
                                px: 4,
                                py: 2,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                                boxShadow: '0 4px 20px rgba(103, 52, 48, 0.4)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(103, 52, 48, 0.6)',
                                    background: 'linear-gradient(135deg, #5a2b28 0%, #7a3e11 100%)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Add Product
                        </Button>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    )
}

export default AddProduct