import axiosInstance from './axiosConfig';

export const searchApi = {
  // Buscar vuelos
  searchFlights: async (searchParams) => {
    const { origin, destination, departureDate, returnDate, passengers } = searchParams;
    
    const params = {
      origin,
      destination,
      departureDate,
      passengers: passengers || 1
    };
    
    if (returnDate) {
      params.returnDate = returnDate;
    }
    
    const response = await axiosInstance.get('/api/search/flights', { params });
    return response.data;
  },

  // Limpiar caché de búsqueda
  clearCache: async () => {
    const response = await axiosInstance.delete('/api/search/cache');
    return response.data;
  }
};

export default searchApi;