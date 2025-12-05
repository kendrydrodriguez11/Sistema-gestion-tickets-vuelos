import { create } from 'zustand';

export const useBookingStore = create((set, get) => ({
  // Estado
  selectedFlight: null,
  selectedSeats: [],
  passengers: [],
  bookingData: null,
  currentStep: 1,
  totalSteps: 3,

  // Acciones
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),

  addSeat: (seat) => {
    const { selectedSeats } = get();
    if (!selectedSeats.find(s => s.seatNumber === seat.seatNumber)) {
      set({ selectedSeats: [...selectedSeats, seat] });
    }
  },

  removeSeat: (seatNumber) => {
    const { selectedSeats } = get();
    set({ 
      selectedSeats: selectedSeats.filter(s => s.seatNumber !== seatNumber) 
    });
  },

  clearSeats: () => set({ selectedSeats: [] }),

  addPassenger: (passenger) => {
    const { passengers } = get();
    set({ passengers: [...passengers, passenger] });
  },

  updatePassenger: (index, passenger) => {
    const { passengers } = get();
    const updated = [...passengers];
    updated[index] = passenger;
    set({ passengers: updated });
  },

  removePassenger: (index) => {
    const { passengers } = get();
    set({ 
      passengers: passengers.filter((_, i) => i !== index) 
    });
  },

  setBookingData: (data) => set({ bookingData: data }),

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  resetBooking: () => set({
    selectedFlight: null,
    selectedSeats: [],
    passengers: [],
    bookingData: null,
    currentStep: 1
  }),

  // Validaciones
  canProceedToPayment: () => {
    const { selectedFlight, selectedSeats, passengers } = get();
    return (
      selectedFlight &&
      selectedSeats.length > 0 &&
      passengers.length === selectedSeats.length &&
      passengers.every(p => 
        p.firstName && 
        p.lastName && 
        p.documentNumber && 
        p.documentType
      )
    );
  }
}));

export default useBookingStore;