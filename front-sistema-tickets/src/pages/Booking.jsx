import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card';
import BookingSummary from '../components/booking/BookingSummary';
import PassengerForm from '../components/booking/PassengerForm';
import SeatSelector from '../components/flights/SeatSelector';
import Spinner from '../components/common/Spinner';
import useBookingStore from '../store/bookingStore';
import useAuthStore from '../store/authStore';
import bookingsApi from '../api/bookingsApi';
import flightsApi from '../api/flightsApi';

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    selectedFlight,
    selectedSeats,
    passengers,
    currentStep,
    nextStep,
    prevStep,
    canProceedToPayment,
    setBookingData
  } = useBookingStore();

  const [availableSeats, setAvailableSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);

  useEffect(() => {
    if (!selectedFlight) {
      toast.error('Debes seleccionar un vuelo primero');
      navigate('/search');
      return;
    }
    loadAvailableSeats();
  }, [selectedFlight]);

  const loadAvailableSeats = async () => {
    if (!selectedFlight) return;
    
    setIsLoadingSeats(true);
    try {
      const seats = await flightsApi.getAvailableSeats(selectedFlight.id);
      setAvailableSeats(seats);
    } catch (error) {
      toast.error('Error al cargar asientos disponibles');
    } finally {
      setIsLoadingSeats(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!canProceedToPayment()) {
      toast.error('Por favor completa toda la información');
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        userId: user.id,
        flightId: selectedFlight.id,
        totalPrice: selectedFlight.currentPrice * selectedSeats.length,
        passengers: passengers.map((passenger, index) => ({
          ...passenger,
          seatNumber: selectedSeats[index].seatNumber
        }))
      };

      const booking = await bookingsApi.createBooking(bookingData);
      setBookingData(booking);
      
      toast.success('¡Reserva creada! Procede al pago');
      navigate('/payment');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear reserva');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Seleccionar Asientos', icon: '💺' },
    { number: 2, title: 'Datos de Pasajeros', icon: '👤' },
    { number: 3, title: 'Confirmar', icon: '✓' }
  ];

  if (!selectedFlight) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Volver
          </Button>

          {/* Stepper */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2
                        transition-all duration-300
                        ${
                          currentStep >= step.number
                            ? 'bg-primary text-white scale-110'
                            : 'bg-gray-200 text-gray-500'
                        }
                      `}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        currentStep >= step.number ? 'text-primary' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-4 rounded transition-all duration-300 ${
                        currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Selecciona tus Asientos'}
                  {currentStep === 2 && 'Información de Pasajeros'}
                  {currentStep === 3 && 'Confirma tu Reserva'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSeats ? (
                  <div className="py-12">
                    <Spinner variant="plane" size="lg" text="Cargando asientos..." />
                  </div>
                ) : (
                  <>
                    {currentStep === 1 && (
                      <SeatSelector availableSeats={availableSeats} />
                    )}

                    {currentStep === 2 && (
                      <PassengerForm />
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <p className="text-blue-800">
                            <strong>⏰ Tu reserva expira en 15 minutos.</strong> Completa el pago
                            para confirmar tus asientos.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-bold text-lg">Resumen de Pasajeros</h3>
                          {passengers.map((passenger, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-semibold text-lg">
                                    {passenger.firstName} {passenger.lastName}
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    {passenger.documentType}: {passenger.documentNumber}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-primary">
                                    Asiento {selectedSeats[index]?.seatNumber}
                                  </div>
                                  <div className="text-gray-500 text-sm">
                                    {selectedSeats[index]?.seatClass}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Botones de navegación */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={isLoading}
                    >
                      Anterior
                    </Button>
                  )}

                  <div className="ml-auto">
                    {currentStep < 3 ? (
                      <Button
                        variant="primary"
                        onClick={nextStep}
                        disabled={
                          (currentStep === 1 && selectedSeats.length === 0) ||
                          (currentStep === 2 && passengers.length !== selectedSeats.length)
                        }
                      >
                        Siguiente
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleCreateBooking}
                        isLoading={isLoading}
                        size="lg"
                      >
                        Proceder al Pago
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen */}
          <div>
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
}