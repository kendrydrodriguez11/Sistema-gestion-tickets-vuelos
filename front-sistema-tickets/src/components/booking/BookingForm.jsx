import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, User, AlertCircle } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import useBookingStore from '../../store/bookingStore';

export default function BookingForm() {
  const navigate = useNavigate();
  const { selectedFlight, selectedSeats, passengers, bookingData } = useBookingStore();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!selectedFlight || !bookingData) {
    return (
      <Alert variant="error" title="Error">
        No hay datos de reserva disponibles.
      </Alert>
    );
  }

  // 🔥 FIX: Asegurar que siempre tengamos un precio válido
  const pricePerSeat = selectedFlight.currentPrice || selectedFlight.basePrice || 0;
  const totalPrice = bookingData.totalPrice || (pricePerSeat * passengers.length);

  const handleProceedToPayment = () => {
    if (!acceptedTerms) {
      return;
    }
    navigate('/payment');
  };

  return (
    <div className="space-y-6">
      {/* Información del Vuelo */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Detalles del Vuelo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Vuelo</div>
              <div className="font-bold text-lg">{selectedFlight.flightNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Referencia</div>
              <div className="font-bold text-lg text-primary">{bookingData.bookingReference}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Salida</div>
              <div className="font-semibold">
                {selectedFlight.route?.originCity || selectedFlight.originCity} ({selectedFlight.route?.originAirport || selectedFlight.originAirport})
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(selectedFlight.departureTime)} - {formatTime(selectedFlight.departureTime)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Llegada</div>
              <div className="font-semibold">
                {selectedFlight.route?.destinationCity || selectedFlight.destinationCity} ({selectedFlight.route?.destinationAirport || selectedFlight.destinationAirport})
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(selectedFlight.arrivalTime)} - {formatTime(selectedFlight.arrivalTime)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Pasajeros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Pasajeros ({passengers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {passengers.map((passenger, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">
                    {passenger.firstName} {passenger.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {passenger.documentType}: {passenger.documentNumber}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">
                    Asiento {selectedSeats[index]?.seatNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedSeats[index]?.seatClass}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Resumen de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Precio por pasajero</span>
              <span className="font-semibold">{formatCurrency(pricePerSeat)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Número de pasajeros</span>
              <span className="font-semibold">× {passengers.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">
                {formatCurrency(pricePerSeat * passengers.length)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tasas e impuestos</span>
              <span className="font-semibold">{formatCurrency(0)}</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Términos y Condiciones */}
      <Card>
        <CardContent>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">
              He leído y acepto los{' '}
              <a href="/terms" className="text-primary hover:underline font-semibold">
                Términos y Condiciones
              </a>
              {' '}y la{' '}
              <a href="/privacy" className="text-primary hover:underline font-semibold">
                Política de Privacidad
              </a>
              . Entiendo que esta reserva expirará en 15 minutos si no completo el pago.
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Alerta de expiración */}
      <Alert variant="warning" title="⏰ Tiempo Limitado">
        Tu reserva expirará el{' '}
        <strong>{formatDate(bookingData.expiresAt)}</strong> a las{' '}
        <strong>{formatTime(bookingData.expiresAt)}</strong>. 
        Completa el pago antes de que expire.
      </Alert>

      {/* Botón de continuar */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleProceedToPayment}
        disabled={!acceptedTerms}
        icon={<CreditCard className="w-5 h-5" />}
      >
        Continuar al Pago
      </Button>
    </div>
  );
}