import axiosInstance from './axiosConfig';

export const bookingsApi = {
  // Crear nueva reserva
  createBooking: async (bookingData) => {
    const response = await axiosInstance.post('/api/bookings', bookingData);
    return response.data;
  },

  // Confirmar reserva
  confirmBooking: async (bookingId, paymentId) => {
    const response = await axiosInstance.put(
      `/api/bookings/${bookingId}/confirm`,
      null,
      { params: { paymentId } }
    );
    return response.data;
  },

  // Cancelar reserva
  cancelBooking: async (bookingId) => {
    const response = await axiosInstance.put(`/api/bookings/${bookingId}/cancel`);
    return response.data;
  },

  // Obtener detalles de una reserva
  getBooking: async (bookingId) => {
    const response = await axiosInstance.get(`/api/bookings/${bookingId}`);
    return response.data;
  },

  // Obtener reserva por referencia
  getBookingByReference: async (reference) => {
    const response = await axiosInstance.get(`/api/bookings/reference/${reference}`);
    return response.data;
  },

  // Obtener reservas del usuario
  getUserBookings: async (userId, page = 0, size = 10) => {
    const response = await axiosInstance.get(`/api/bookings/user/${userId}`, {
      params: { page, size }
    });
    return response.data;
  }
};

export default bookingsApi;