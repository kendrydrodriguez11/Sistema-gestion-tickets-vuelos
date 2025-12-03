import api from './api';

const notificationService = {
  async getAllNotifications(page = 0, size = 10) {
    const response = await api.get('/api/notifications', {
      params: { page, size },
    });
    return response.data;
  },

  async getUnreadNotifications(page = 0, size = 10) {
    const response = await api.get('/api/notifications/unread', {
      params: { page, size },
    });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/api/notifications/unread/count');
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.put('/api/notifications/read-all');
    return response.data;
  },
};

export default notificationService;