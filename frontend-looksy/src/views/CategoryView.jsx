import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiAxios from '../config/cienteAxios';

function CategoryView() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        console.log('Fetching category with ID:', categoryId);
        
        // Use your configured apiAxios and correct endpoint
        const response = await apiAxios.get(`/category/${categoryId}`);
        console.log('Category response:', response.data);
        
        // Handle different response structures
        const categoryData = response.data.data || response.data;
        setCategory(categoryData);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
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
    <Box sx={{ mt: 8 }}> {/* Add margin top to account for header */}
      {/* Banner Image */}
      <Box
        component="img"
        sx={{
          width: '100%',
          height: 'auto',
          maxHeight: '500px',
          objectFit: 'cover',
          display: 'block',
        }}
        src={'/bannerEarrings.webp'} // Remove /public/ from path
        alt={`Banner ${category?.nombre || 'Category'}`}
        onError={(e) => {
          e.target.src = '/defaultBanner.webp'; // Fallback image
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
      </Box>
    </Box>
  );
}

export default CategoryView;