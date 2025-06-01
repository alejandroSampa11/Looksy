import axios from 'axios';

const apiAxios = axios.create({
  baseURL: 'http://localhost:3000/api',  // Ajusta la URL según tu backend
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiAxios;