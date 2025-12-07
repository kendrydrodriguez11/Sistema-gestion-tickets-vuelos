import axiosInstance from './axiosConfig';

export const authApi = {
  // Obtener perfil del usuario actual (usando el token de Auth0)
  getProfile: async () => {
    try {
      console.log('Calling /api/auth/me endpoint...');
      const response = await axiosInstance.get('/api/auth/me');
      console.log('Profile response:', response.data);
      
      // El backend devuelve { user: {...}, authenticated: true }
      if (response.data && response.data.user) {
        return response.data.user;
      }
      
      throw new Error('Invalid response format from /api/auth/me');
    } catch (error) {
      console.error('Error in getProfile:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Validar token
  validateToken: async (token) => {
    try {
      console.log('Validating token...');
      const response = await axiosInstance.post('/api/auth/introspect', { token });
      console.log('Token validation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error validating token:', error);
      throw error;
    }
  },

  // Obtener información del usuario por ID
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  },

  // Cerrar sesión
  logout: () => {
    console.log('Logging out, clearing tokens...');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export default authApi;