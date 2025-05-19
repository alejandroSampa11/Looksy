import { Box, Typography } from '@mui/material'
import React from 'react'

function WatchesView() {
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
                src="../public/bannerWatches.webp"
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
                    Rings
                </Typography>
                <Typography sx={{ color: '#000000', textAlign: 'center', marginTop: 1 }} variant="h5">
                    Discover our exquisite collection of rings—timeless elegance for every occasion.
                </Typography>
            </Box>
        </>
    )
}

export default WatchesView