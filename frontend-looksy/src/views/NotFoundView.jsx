import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function NotFoundView() {
    const navigate = useNavigate()

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#F0F1EB',
            padding: 3
        }}>
            <Typography variant="h1" sx={{ color: '#673430', mb: 2 }}>
                404
            </Typography>
            <Typography variant="h4" sx={{ color: '#000000', mb: 4 }}>
                Página no encontrada
            </Typography>
            <Button 
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                    backgroundColor: '#673430',
                    '&:hover': {
                        backgroundColor: '#4a2521'
                    }
                }}
            >
                Volver al inicio
            </Button>
        </Box>
    )
}

export default NotFoundView