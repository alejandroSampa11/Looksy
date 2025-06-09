import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate } from "react-router-dom";
import apiAxios from "../config/cienteAxios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from '../redux/slices/userSlice';

function LoginView() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, setLogin] = useState({ username: '', password: '' });

    const handleLogin = async () => {
        try {
            const response = await apiAxios.post('/users/login', login);
            toast.success('¡Bienvenido!');
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            if (response.data.data) {
                localStorage.setItem('user', JSON.stringify(response.data.data));

                dispatch(setUser({
                    data: response.data.data,
                    isAdmin: response.data.data.rol === 'admin'
                }));
            }

            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

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
                    value={login.username}
                    onChange={(e) => setLogin({ ...login, username: e.target.value })}
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
                    value={login.password}
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
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
                    onClick={handleLogin}
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