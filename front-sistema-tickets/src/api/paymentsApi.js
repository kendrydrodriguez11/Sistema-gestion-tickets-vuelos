import axiosInstance from './axiosConfig';

export const paymentsApi = {
  // Iniciar pago
  initiatePayment: async (paymentData, userId) => {
    const idempotencyKey = crypto.randomUUID();
    
    const response = await axiosInstance.post('/api/payments', paymentData, {
      headers: {
        'X-User-Id': userId,
        'Idempotency-Key': idempotencyKey
      }
    });
    return response.data;
  },

  // Capturar pago de PayPal
  capturePayment: async (paypalOrderId) => {
    const response = await axiosInstance.post(`/api/payments/capture/${paypalOrderId}`);
    return response.data;
  },

  // Obtener detalles de pago
  getPayment: async (paymentId) => {
    const response = await axiosInstance.get(`/api/payments/${paymentId}`);
    return response.data;
  },

  // Obtener pago por reserva
  getPaymentByBooking: async (bookingId) => {
    const response = await axiosInstance.get(`/api/payments/booking/${bookingId}`);
    return response.data;
  },

  // Obtener pagos del usuario
  getUserPayments: async (userId, page = 0, size = 10) => {
    const response = await axiosInstance.get(`/api/payments/user/${userId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Cancelar pago
  cancelPayment: async (paymentId) => {
    const response = await axiosInstance.put(`/api/payments/${paymentId}/cancel`);
    return response.data;
  },

  // Solicitar reembolso
  refundPayment: async (paymentId, reason) => {
    const response = await axiosInstance.post(
      `/api/payments/${paymentId}/refund`,
      null,
      { params: { reason } }
    );
    return response.data;
  }
};

export default paymentsApi;