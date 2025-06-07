import { Box, Typography } from '@mui/material'
import CardItem from '../components/CardItem'
import { useSelector } from 'react-redux';

const products = [
  {
    id: 1,
    title: "Golden Bracelet",
    price: 59.99,
    image: "bracelet.webp"  
  },
  {
    id: 2,
    title: "Silver Ring",
    price: 45.99,
    image: "bracelet.webp"  
  },
  {
    id: 3,
    title: "Pearl Necklace",
    price: 89.99,
    image: "bracelet.webp"  
  },
   {
    id: 1,
    title: "Golden Bracelet",
    price: 59.99,
    image: "bracelet.webp" 
  },
  {
    id: 2,
    title: "Silver Ring",
    price: 45.99,
    image: "bracelet.webp" 
  },
  {
    id: 3,
    title: "Pearl Necklace",
    price: 89.99,
    image: "bracelet.webp" 
  },
   {
    id: 1,
    title: "Golden Bracelet",
    price: 59.99,
    image: "bracelet.webp"
  },
  {
    id: 2,
    title: "Silver Ring",
    price: 45.99,
    image: "bracelet.webp"
  },
  {
    id: 3,
    title: "Pearl Necklace",
    price: 89.99,
    image: "bracelet.webp" 
  },
   {
    id: 1,
    title: "Golden Bracelet",
    price: 59.99,
    image: "bracelet.webp" 
  },
  {
    id: 2,
    title: "Silver Ring",
    price: 45.99,
    image: "bracelet.webp"
  },
  {
    id: 3,
    title: "Pearl Necklace",
    price: 89.99,
    image: "bracelet.webp" 
  }
]

function HomeView() {
    const { userInfo, isAdmin } = useSelector(state => state.user);

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
                <Typography sx={{ color: '#000000', textAlign: 'center' }} variant="h3">
                    Accessories
                </Typography>
                <Typography sx={{ color: '#000000', textAlign: 'center', marginTop: 1 }} variant="h5">
                    From bags to jewelry—we've got the perfect accessories for every style.
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
                        imagen={product.image}
                        nombre={product.title}
                        precio={product.price}
                    />
                ))}
            </Box>
        </>
    )
}

export default HomeView