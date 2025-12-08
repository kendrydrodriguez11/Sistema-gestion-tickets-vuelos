import axios from 'axios';
import toast from 'react-hot-toast';

// 🔥 IMPORTANTE: Usar el GATEWAY, no el microservicio directamente
// El gateway está en puerto 8080 y redirige a los microservicios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('📋 Todas las peticiones pasarán por el API Gateway');

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
    
    console.log('📤 REQUEST:', {
      método: config.method.toUpperCase(),
      ruta: config.url,
      tieneToken: !!token,
      baseURL: config.baseURL
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token agregado al header');
    } else {
      console.warn('⚠️ No hay token en localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejar errores
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE:', {
      status: response.status,
      ruta: response.config.url,
      datos: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('❌ RESPONSE ERROR:', {
      status: error.response?.status,
      url: error.config?.url,
      mensaje: error.message,
      errorData: error.response?.data
    });

    // Si el token expiró (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Token expirado o inválido, limpiando sesión...');
      originalRequest._retry = true;

      // Limpiar storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Mostrar error solo si no estamos ya en la página de login
      if (!window.location.pathname.includes('/login')) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        window.location.href = '/';
      }
      
      return Promise.reject(error);
    }

    // Manejar otros errores
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message ||
                        'Ha ocurrido un error';
    
    if (error.response?.status !== 401) {
      console.error('🚨 Error de API:', errorMessage);
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;