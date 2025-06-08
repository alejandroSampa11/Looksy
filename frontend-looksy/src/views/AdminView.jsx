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
import Statitics from '../components/Admin/Statistics';


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
      if (response.status === 200) {
        const transformedProducts = response.data.data.map(item => ({
          id: item._id,
          name: item.nombre,
          category: item.categoria,
          subcategoria: item.subcategoria,
          price: item.precio,
          stock: item.stock,
          description: item.descripcion || '',
          imageUrl: item.imageUrl || '',
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
            <Statitics
            />
          )}
        </Container>
      </Box >
    );
  }
}

export default AdminView;
