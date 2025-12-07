import axiosInstance from './axiosConfig';

export const authApi = {
  // Obtener perfil del usuario actual (usando el token de Auth0)
  getProfile: async () => {
    const response = await axiosInstance.get('/api/auth/me');
    return response.data.user;
  },

  // Validar token
  validateToken: async (token) => {
    const response = await axiosInstance.post('/api/auth/introspect', { token });
    return response.data;
  },

  // Obtener información del usuario por ID
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};

export default authApi;