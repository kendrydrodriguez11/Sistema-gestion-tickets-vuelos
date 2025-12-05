import axiosInstance from './axiosConfig';

export const authApi = {
  // Registrar nuevo usuario
  register: async (userData) => {
    const response = await axiosInstance.post('/api/auth/register', userData);
    return response.data;
  },

  // Iniciar sesión (devuelve URL de OAuth2)
  getLoginUrl: async () => {
    const response = await axiosInstance.get('/api/auth/login');
    return response.data;
  },

  // Validar token
  validateToken: async (token) => {
    const response = await axiosInstance.post('/api/auth/introspect', { token });
    return response.data;
  },

  // Obtener perfil del usuario actual
  getProfile: async () => {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export default authApi;