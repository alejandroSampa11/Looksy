import React from 'react';
import { FiOctagon } from 'react-icons/fi';
import { Box } from '@mui/material';

function LoadingSpinner() {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200
        }}>
            <FiOctagon size={48} className='spin' color='#673430'/>
            <style>
                {`
                .spin {
                    animation: spin 2s linear infinite;
                }
                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </Box>
    )
}

export default LoadingSpinner;