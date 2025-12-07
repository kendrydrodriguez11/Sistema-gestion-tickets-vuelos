import axios from 'axios';
import toast from 'react-hot-toast';

// Vite usa import.meta.env en lugar de process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

console.log('API Base URL:', API_BASE_URL);
console.log('All env vars:', import.meta.env);

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - Agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('Request to:', config.url);
    console.log('Token exists:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request');
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejar errores
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  async (error) => {
    console.error('Response error:', error.response?.status, error.message);
    
    const originalRequest = error.config;

    // Si el token expiró (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Token expired or invalid, redirecting to login');
      originalRequest._retry = true;

      // Limpiar storage y redirigir a login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Mostrar error solo si no estamos ya en la página de login
      if (!window.location.pathname.includes('/login')) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }

    // Manejar otros errores
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'Ha ocurrido un error';
    
    // No mostrar toast para errores 401 (ya lo manejamos arriba)
    if (error.response?.status !== 401) {
      console.error('API Error:', errorMessage);
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;