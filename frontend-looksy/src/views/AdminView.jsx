import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Card,
  CardContent,
  Divider,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Stack,
  alpha,
  Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiamondIcon from '@mui/icons-material/Diamond';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import apiAxios from '../config/cienteAxios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'


const categoryOptions = [
  { value: 'rings', label: 'Rings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'watches', label: 'Watches' },
];

function AdminView() {

  //#region STATES
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'rings', price: '', stock: '', description: '', imageUrl: '' });

  //#region EFFECTS
  useEffect(() => {
    if (tabValue === 2 || tabValue === 1) {
      fetchProducts();
    }
  }, [tabValue]);

  const fetchProducts = async () => {
    try {
      const response = await apiAxios.get('/item');
      console.log(response);
      if (response.status === 200) {
        const transformedProducts = response.data.data.map(item => ({
          id: item._id,
          name: item.nombre,
          category: getCategoryName(item.categoria),
          price: item.precio,
          stock: item.stock,
          description: item.descripcion || '',
          imageUrl: item.urlImage || '',
          sales: item.sales || 0,
          rating: item.rating || 4.5
        }));
        setProducts(transformedProducts);
      }
    } catch (e) {
      console.error('Error al obtener productos:', e);
    }
  }

  const getCategoryName = (categoryNumber) => {
    const categoryMap = {
      1: 'rings',
      2: 'necklaces',
      3: 'earrings',
      4: 'bracelets',
      5: 'watches'
    };
    return categoryMap[categoryNumber] || 'rings';
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'rings',
      price: '',
      stock: '',
      description: '',
      imageUrl: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const getCategoryNumber = (categoryName) => {
    const categoryMap = {
      'rings': 1,
      'necklaces': 2,
      'earrings': 3,
      'bracelets': 4,
      'watches': 5
    };
    return categoryMap[categoryName] || 1;
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      const itemData = {
        nombre: formData.name,
        categoria: getCategoryNumber(formData.category),
        precio: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        descripcion: formData.description,
        urlImage: formData.imageUrl
      };

      const response = await apiAxios.post('/item', itemData);
      const result = response.data;

      if (response.status !== 201) {
        throw new Error(result.message || 'Error al crear el producto');
      }

      resetForm();
      toast.success('Producto creado exitosamente!');
    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error(`Error al crear el producto: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    console.log(productId);
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
      console.error('Error updating product:', error);
      toast.error(`Error updating product: ${error.message}`);
    }
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const totalSales = products.reduce((sum, product) => sum + product.sales, 0);

  const categories = [...new Set(products.map(product => product.category))];
  const bestSellingProduct = products.length > 0
    ? products.reduce((prev, current) => (prev.sales > current.sales) ? prev : current)
    : { name: 'No products', imageUrl: '', sales: 0 };

  const highestRatedProduct = products.length > 0
    ? products.reduce((prev, current) => (prev.rating > current.rating) ? prev : current)
    : { name: 'No products', imageUrl: '', rating: 0 };

  const getStockColor = (stock) => {
    if (stock < 5) return 'error';
    if (stock < 10) return 'warning';
    return 'success';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'rings': return '💍';
      case 'necklaces': return '📿';
      case 'earrings': return '👂';
      case 'bracelets': return '💎';
      case 'watches': return '⌚';
      default: return '💎';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #d0d3d8 100%)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          p: 3,
          background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
          borderRadius: 4,
          color: 'white',
          boxShadow: '0 8px 32px rgba(103, 52, 48, 0.3)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DiamondIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff 30%, #efe8be 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Jewelry Store Admin
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Manage your luxury collection
              </Typography>
            </Box>
          </Box>
          <Chip
            label="Admin Mode"
            sx={{
              background: 'rgba(255, 215, 0, 0.2)',
              color: 'white',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(103, 52, 48, 0.2)'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                py: 3,
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha('#673430', 0.1),
                  transform: 'translateY(-2px)'
                }
              },
              '& .Mui-selected': {
                color: '#673430'
              },
              '& .MuiTabs-indicator': {
                height: 3,
                background: 'linear-gradient(45deg, #673430, #8B4513)'
              }
            }}
          >
            <Tab label="Add Product" icon={<AddIcon />} iconPosition="start" />
            <Tab label="Edit Product" icon={<EditIcon />} iconPosition="start" />
            <Tab label="Manage Inventory" icon={<DeleteIcon />} iconPosition="start" />
            <Tab label="Store Statistics" icon={<ShowChartIcon />} iconPosition="start" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
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
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                      <TextField
                        fullWidth
                        label="Image URL"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        variant="outlined"
                        placeholder="/api/placeholder/150/150"
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
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Avatar
                          src={formData.imageUrl}
                          variant="rounded"
                          sx={{
                            width: 80,
                            height: 80,
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
        )}

        {tabValue === 1 && (
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
                                src={product.imageUrl}
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
        )}

        {tabValue === 2 && (
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
                            src={product.imageUrl}
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
        )}

        {tabValue === 3 && (
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
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShowChartIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
                    Store Statistics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overview of your store's performance and inventory status.
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, transparent, #4facfe, transparent)' }} />

              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.05"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z"/%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.1
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, position: 'relative' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                        Key Metrics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <InventoryIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {totalProducts}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Products
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <CategoryIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {categories.length}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Categories
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <ShoppingCartIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {totalSales}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Total Sales
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <AttachMoneyIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              ${totalValue.toFixed(0)}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Inventory Value
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                        Top Products
                      </Typography>

                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.9 }}>
                          🏆 Best Selling Product
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)'
                        }}>
                          <Avatar
                            src={bestSellingProduct.imageUrl}
                            variant="rounded"
                            sx={{ width: 50, height: 50, mr: 2, border: '2px solid white' }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 600 }}>
                              {bestSellingProduct.name}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {bestSellingProduct.sales} sales
                            </Typography>
                          </Box>
                          <TrendingUpIcon sx={{ fontSize: 30 }} />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, (bestSellingProduct.sales / totalSales) * 100)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.9 }}>
                          ⭐ Highest Rated Product
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)'
                        }}>
                          <Avatar
                            src={highestRatedProduct.imageUrl}
                            variant="rounded"
                            sx={{ width: 50, height: 50, mr: 2, border: '2px solid white' }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 600 }}>
                              {highestRatedProduct.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <StarIcon sx={{ fontSize: 18, mr: 0.5 }} />
                              <Typography variant="body2">
                                {highestRatedProduct.rating} / 5.0
                              </Typography>
                            </Box>
                          </Box>
                          <StarIcon sx={{ fontSize: 30 }} />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={highestRatedProduct.rating * 20}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 'white'
                            }
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>


                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                        📊 Category Overview
                      </Typography>
                      <Grid container spacing={3}>
                        {categories.map(category => {
                          const categoryProducts = products.filter(p => p.category === category);
                          const categoryStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
                          const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
                          const avgRating = categoryProducts.reduce((sum, p) => sum + p.rating, 0) / categoryProducts.length;

                          return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={category}>
                              <Card
                                sx={{
                                  height: '100%',
                                  borderRadius: 2,
                                  background: 'rgba(255,255,255,0.1)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                  }
                                }}
                              >
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                  <Typography variant="h3" sx={{ mb: 1 }}>
                                    {getCategoryIcon(category)}
                                  </Typography>
                                  <Typography variant="h6" sx={{
                                    fontWeight: 700,
                                    textTransform: 'capitalize',
                                    mb: 2
                                  }}>
                                    {category}
                                  </Typography>

                                  <Box sx={{ textAlign: 'left' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Products:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {categoryProducts.length}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Stock:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {categoryStock}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                      <Typography variant="body2">Value:</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        ${categoryValue.toFixed(0)}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2">Avg Rating:</Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          {avgRating.toFixed(1)}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box >
  );
}

export default AdminView;