import { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Grid, Avatar, Card, CardContent, Divider, Chip, LinearProgress, Stack, alpha, Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import apiAxios from '../config/cienteAxios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddProduct from '../components/Admin/AddProduct';
import EditProduct from '../components/Admin/EditProduct';
import DeleteProduct from '../components/Admin/DeleteProduct';


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

  const { userInfo, isAdmin } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin]);

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

  if (isAdmin) {
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
            <AddProduct
              resetForm={resetForm}
              formData={formData}
              handleInputChange={handleInputChange}
              categoryOptions={categoryOptions}
              getCategoryNumber={getCategoryNumber}
              getCategoryIcon={getCategoryIcon}
            />
          )}

          {tabValue === 1 && (
            <EditProduct
              selectedProduct={selectedProduct}
              products={products}
              getStockColor={getStockColor}
              setSelectedProduct={setSelectedProduct}
              setFormData={setFormData}
              getCategoryIcon={getCategoryIcon}
              resetForm={resetForm}
              formData={formData}
              getCategoryNumber={getCategoryNumber}
              fetchProducts={fetchProducts}
              handleInputChange={handleInputChange}
              categoryOptions={categoryOptions}
            />
          )}

          {tabValue === 2 && (
            <DeleteProduct
              products={products}
              getCategoryIcon={getCategoryIcon}
              getStockColor={getStockColor}
              fetchProducts={fetchProducts} />
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
}

export default AdminView;