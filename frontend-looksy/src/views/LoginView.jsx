import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate } from "react-router-dom";

function LoginView() {
    const navigate = useNavigate();

    return (
        <Box sx={{
            textAlign: 'center',
            width: '100%',
            height: '100vh',
            backgroundColor: '#F0F1EB',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Box sx={{
                backgroundColor: '#fff',
                padding: 4,
                borderRadius: 2,
                boxShadow: 3,
                width: '450px'
            }}>
                <Typography variant="h4" sx={{ color: '#000000', mb: 3 }}>
                    Log In
                </Typography>

                <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutlineIcon sx={{ color: '#673430' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlinedIcon sx={{ color: '#673430' }} />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    sx={{
                        width: '100%',
                        backgroundColor: '#673430',
                        '&:hover': {
                            backgroundColor: '#4a2521'
                        },
                        mt: 2  
                    }}
                >
                    Acceder
                </Button>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2  
                    }}
                >
                    <Button
                        sx={{
                            color: '#673430',
                            textTransform: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        ¿Olvidaste tu contraseña?
                    </Button>
                    <Button
                        sx={{
                            color: '#673430',
                            textTransform: 'none',
                            fontSize: '0.9rem'
                        }}
                        onClick={() => navigate('/sign-up')}

                    >
                        Crear Cuenta
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default LoginView