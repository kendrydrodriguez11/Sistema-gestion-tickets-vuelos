import api from './api';
import {jwtDecode} from 'jwt-decode';

const movementService = {
  async createMovement(movementData) {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.idUser;

    const response = await api.post('/api/inventory/movements', movementData, {
      headers: {
        'X-User-Id': userId,
      },
    });
    return response.data;
  },

  async getAllMovements(page = 0, size = 10) {
    const response = await api.get('/api/inventory/movements', {
      params: { page, size },
    });
    return response.data;
  },

  async getMovementsByProduct(productId, page = 0, size = 10) {
    const response = await api.get(`/api/inventory/movements/product/${productId}`, {
      params: { page, size },
    });
    return response.data;
  },
};

export default movementService;