import axiosInstance from './axiosConfig';

export const flightsApi = {
  // Obtener detalles de un vuelo
  getFlightDetails: async (flightId) => {
    const response = await axiosInstance.get(`/api/flights/${flightId}`);
    return response.data;
  },

  // Obtener asientos disponibles de un vuelo
  getAvailableSeats: async (flightId) => {
    const response = await axiosInstance.get(`/api/flights/${flightId}/seats/available`);
    return response.data;
  },

  // Obtener todos los vuelos (con paginación)
  getAllFlights: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/api/flights', {
      params: { page, size }
    });
    return response.data;
  },

  // Buscar vuelos
  searchFlights: async (origin, destination, date) => {
    const response = await axiosInstance.get('/api/flights/search', {
      params: { origin, destination, date }
    });
    return response.data;
  },

  // Obtener vuelo con precio dinámico
  getFlightWithPricing: async (flightId) => {
    const response = await axiosInstance.get(`/api/flights/${flightId}/with-pricing`);
    return response.data;
  }
};

export default flightsApi;