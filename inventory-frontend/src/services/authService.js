import api from './api';
import {jwtDecode} from 'jwt-decode';

const authService = {
  async login(username, password) {
    const response = await api.post('/api/auth/login', {
      username,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const decoded = jwtDecode(response.data.token);
      localStorage.setItem('user', JSON.stringify(decoded));
    }
    
    return response.data;
  },

  async register(formData) {
    const response = await api.post('/api/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};

export default authService;