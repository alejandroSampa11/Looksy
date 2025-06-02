import axios from 'axios';

const apiAxios = axios.create({
  baseURL: 'http://localhost:3000/api',  // Ajusta la URL según tu backend
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default apiAxios;