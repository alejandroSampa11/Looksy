import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import apiAxios from "../config/cienteAxios";
import { toast } from 'react-toastify';

function SignUpView() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ email: '', firstName: '', lastName: '', username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);


    const handleAcceder = async () => {
        if (!user.username || !user.email || !user.password || !user.firstName || !user.lastName) {
            toast.error('Por favor complete todos los campos');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            toast.error('El formato del correo electrónico no es válido');
            return;
        }
        if (user.password.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        setIsLoading(true);
        try {
            const userData = {
                ...user,
                rol: 'user'
            };

            const response = await apiAxios.post('/users', userData);
            console.log(response.data);
            const { token, user: createdUser } = response.data;
            if (token) {
                localStorage.setItem('token', token);
            }
            localStorage.setItem('user', JSON.stringify(createdUser));
            toast.success('¡Usuario creado exitosamente!');
            navigate('/');
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                toast.error(`Error: ${error.response.data.message || 'No se pudo crear el usuario'}`);
            } else {
                toast.error(`Error: ${error.message || 'No se pudo crear el usuario'}`);
            }
        } finally {
            setIsLoading(false);
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
                    Sign Up
                </Typography>

                <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    value={user.username}
                    onChange={(e) => { setUser({ ...user, username: e.target.value }) }}
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
                    label="First Name"
                    variant="outlined"
                    margin="normal"
                    value={user.firstName}
                    onChange={(e) => { setUser({ ...user, firstName: e.target.value }) }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon sx={{ color: '#673430' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    margin="normal"
                    value={user.lastName}
                    onChange={(e) => { setUser({ ...user, lastName: e.target.value }) }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <BadgeIcon sx={{ color: '#673430' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={user.email}
                    onChange={(e) => { setUser({ ...user, email: e.target.value }) }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon sx={{ color: '#673430' }} />
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
                    value={user.password}
                    onChange={(e) => { setUser({ ...user, password: e.target.value }) }}
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
                    onClick={handleAcceder}
                    disabled={isLoading}
                    sx={{
                        width: '100%',
                        backgroundColor: '#673430',
                        '&:hover': {
                            backgroundColor: '#4a2521'
                        },
                        mt: 2
                    }}
                >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
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
                            fontSize: '0.9rem',
                            display: 'flex',
                            flexDirection: 'column',
                            lineHeight: 1.5
                        }}
                        onClick={() => navigate('/login')}
                    >
                        ¿Ya tienes una cuenta?
                        <br />
                        Identificate!
                    </Button>
                    <Button
                        sx={{
                            color: '#673430',
                            textTransform: 'none',
                            fontSize: '0.9rem'
                        }}

                    >
                        ¿Olvidaste tu contraseña?
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default SignUpView