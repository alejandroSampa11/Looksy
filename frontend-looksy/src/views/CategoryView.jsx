import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiAxios from '../config/cienteAxios';
import CardItem from '../components/CardItem';

function CategoryView() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const categoryBanners = {
    'Rings': '/bannerEarrings.webp',
    'Necklaces': '/bannerNeck.webp',
    // Add more mappings as needed
  };

  const getBannerImage = () => {
    if (category?.banner) {
      return category.banner;
    }
    return categoryBanners[category?.nombre] || '/bannerNew.webp';
  };

  getBannerImage();

  useEffect(() => {
    const fetchProducts = async (categoryData) => {
      try {
        let endpoint;

        if (categoryData?.hasChildren && categoryData?.children.length > 0) {
          endpoint = `/item/category/${categoryData._id}`;
        } else {
          endpoint = `/item/subcategory/${categoryData._id}`;
        }
        const data = await apiAxios.get(endpoint);
        setProducts(data.data.data);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await apiAxios.get(`/category/${categoryId}`)
        setCategory(data.data.data);
        return data.data.data;
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      if (categoryId) {
        try {
          setLoading(true);
          const categoryData = await fetchCategory();
          await fetchProducts(categoryData);
        } catch (err) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Box
        component="img"
        sx={{
          width: '100%',
          height: 'auto',
          maxHeight: '500px',
          objectFit: 'cover',
          display: 'block',
        }}
        src={getBannerImage()}
        alt={`Banner ${category?.nombre || 'New Arrivals'}`}
        onError={(e) => {
          e.target.src = '/defaultBanner.webp';
        }}
      />

      {/* Category Info */}
      <Box sx={{
        padding: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h3" sx={{
          color: '#673430',
          fontWeight: 'bold',
          mb: 2
        }}>
          {category?.nombre || 'Categoría'}
        </Typography>

        <Typography variant="h6" sx={{
          color: '#666',
          maxWidth: 800,
          mx: 'auto'
        }}>
          {category?.descripcion || 'Explora nuestros productos seleccionados.'}
        </Typography>

        {/* Show children if any */}
        {category?.hijos && category.hijos.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#673430' }}>
              Subcategorías
            </Typography>
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2
            }}>
              {category.hijos.map((child) => (
                <Box
                  key={child._id}
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                  onClick={() => navigate(`/category/${child._id}`)}
                >
                  <Typography variant="body1">{child.nombre}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {products && products.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Grid container spacing={3} justifyContent="center">
              {products.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                  <CardItem
                    imagen={product.imageUrl}
                    nombre={product.nombre}
                    precio={product.precio}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* No products message */}
        {products && products.length === 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" sx={{ color: '#666' }}>
              No hay productos disponibles en esta categoría.
            </Typography>
          </Box>
        )}

      </Box>
    </Box>
  );
}

export default CategoryView;