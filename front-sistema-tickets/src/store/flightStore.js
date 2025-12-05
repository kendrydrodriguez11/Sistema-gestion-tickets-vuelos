import { create } from 'zustand';

export const useFlightStore = create((set, get) => ({
  // Estado
  searchParams: {
    origin: '',
    destination: '',
    departureDate: null,
    returnDate: null,
    passengers: 1
  },
  searchResults: [],
  selectedFlight: null,
  isSearching: false,
  error: null,

  // Acciones
  setSearchParams: (params) => set({ 
    searchParams: { ...get().searchParams, ...params } 
  }),

  clearSearchParams: () => set({
    searchParams: {
      origin: '',
      destination: '',
      departureDate: null,
      returnDate: null,
      passengers: 1
    }
  }),

  setSearchResults: (results) => set({ searchResults: results }),

  setSelectedFlight: (flight) => set({ selectedFlight: flight }),

  setIsSearching: (isSearching) => set({ isSearching }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Filtros
  filterByPrice: (maxPrice) => {
    const { searchResults } = get();
    return searchResults.filter(flight => 
      flight.currentPrice <= maxPrice
    );
  },

  filterByDepartureTime: (timeRange) => {
    const { searchResults } = get();
    // timeRange: 'morning', 'afternoon', 'evening', 'night'
    return searchResults.filter(flight => {
      const hour = new Date(flight.departureTime).getHours();
      switch(timeRange) {
        case 'morning': return hour >= 6 && hour < 12;
        case 'afternoon': return hour >= 12 && hour < 18;
        case 'evening': return hour >= 18 && hour < 22;
        case 'night': return hour >= 22 || hour < 6;
        default: return true;
      }
    });
  },

  sortByPrice: (order = 'asc') => {
    const { searchResults } = get();
    const sorted = [...searchResults].sort((a, b) => {
      return order === 'asc' 
        ? a.currentPrice - b.currentPrice
        : b.currentPrice - a.currentPrice;
    });
    set({ searchResults: sorted });
  },

  sortByDuration: (order = 'asc') => {
    const { searchResults } = get();
    const sorted = [...searchResults].sort((a, b) => {
      return order === 'asc'
        ? a.durationMinutes - b.durationMinutes
        : b.durationMinutes - a.durationMinutes;
    });
    set({ searchResults: sorted });
  }
}));

export default useFlightStore;