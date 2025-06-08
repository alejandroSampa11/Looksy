import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Pagination  } from '@mui/material'
import CardItem from '../components/CardItem'
import LoadingSpinner from '../components/LoadingSpinner';
import apiAxios from '../config/cienteAxios';
import { setProducts, setTotalPages } from '../redux/slices/productSlice';
import { useSelector, useDispatch } from 'react-redux';

export async function fetchProducts(filterStr, page) {
  try {
    const response = await apiAxios.post(`/item/getItems/${page > 0 ? page : 1}`, {filterString: filterStr});
    return response.data;
  } catch (e) {
    console.error('Error obteniendo productos en HomeView', e);
  }
}

function HomeView() {
    const dispatch = useDispatch();
    const { userInfo, isAdmin } = useSelector(state => state.user);
    const { searchFilter } = useSelector(state => state.searchFilter);
    const { items: products, totalPages } = useSelector(state => state.products);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
      (async () => {
        if (page <= totalPages) {
          const productsResponse = await fetchProducts(searchFilter, page);
          dispatch(setProducts(productsResponse.data));
          dispatch(setTotalPages(productsResponse.totalPages));
        }
        setIsLoading(false);
      })()
    }, [page, searchFilter, dispatch])

    if (isLoading) {
        return (
          <Card
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'none',
              borderRadius: 0,
            }}
          >
            <LoadingSpinner />
          </Card>
        );
      }

    return (
        <>
            <Box
                component="img"
                sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                    objectFit: 'cover',
                    display: 'block',
                    marginTop: 6
                }}
                src="../public/banner.jpg"
                alt="Banner"
            />
            <Box sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                display: 'block',
                marginTop: 6
            }}>
                <Typography sx={{ color: '#000000', textAlign: 'center' }} variant="h4">
                    Worn Beautifully.
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    mt: 6,
                    flexWrap: 'wrap',
                    gap: 5
                }}
            >
                {products.map((product) => (
                    <CardItem
                        key={product.id}
                        imagen={product.imageUrl}
                        nombre={product.nombre}
                        precio={product.precio}
                    />
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color='#FFF'
                size='large'
              />
            </Box>
        </>
    )
}

export default HomeView