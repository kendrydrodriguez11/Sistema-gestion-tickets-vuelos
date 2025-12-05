import { Plane, MapPin, Calendar, Users, CreditCard } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../common/Card';
import Badge from '../common/Badge';
import { formatCurrency, formatDate, formatTime, formatFlightDuration } from '../../utils/formatters';
import useBookingStore from '../../store/bookingStore';

export default function BookingSummary() {
  const { selectedFlight, selectedSeats, passengers } = useBookingStore();

  if (!selectedFlight) {
    return (
      <Card>
        <CardContent>
          <p className="text-gray-500 text-center">No hay vuelo seleccionado</p>
        </CardContent>
      </Card>
    );
  }

  const subtotal = selectedFlight.currentPrice * selectedSeats.length;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Resumen de Reserva</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Vuelo */}
        <div>
          <div className="flex items-center gap-2 text-primary font-bold mb-3">
            <Plane className="w-5 h-5" />
            <span>{selectedFlight.flightNumber}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Origen</div>
                <div className="text-gray-600 text-sm">
                  {selectedFlight.route.originCity} ({selectedFlight.route.originAirport})
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Destino</div>
                <div className="text-gray-600 text-sm">
                  {selectedFlight.route.destinationCity} ({selectedFlight.route.destinationAirport})
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Fecha y hora</div>
                <div className="text-gray-600 text-sm">
                  {formatDate(selectedFlight.departureTime)}
                </div>
                <div className="text-gray-600 text-sm">
                  {formatTime(selectedFlight.departureTime)} - {formatTime(selectedFlight.arrivalTime)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Asientos */}
        {selectedSeats.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 font-semibold mb-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span>Asientos Seleccionados ({selectedSeats.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <Badge key={seat.id} variant="success">
                  {seat.seatNumber}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Pasajeros */}
        {passengers.length > 0 && (
          <div className="pt-4 border-t">
            <div className="font-semibold mb-2">Pasajeros ({passengers.length})</div>
            <div className="space-y-2">
              {passengers.map((passenger, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {index + 1}. {passenger.firstName} {passenger.lastName}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Precio */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Precio por persona</span>
            <span className="font-semibold">{formatCurrency(selectedFlight.currentPrice)}</span>
          </div>
          
          {selectedSeats.length > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pasajeros</span>
                <span className="font-semibold">× {selectedSeats.length}</span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Info adicional */}
        <div className="pt-4 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <p>✓ Equipaje de mano incluido</p>
            <p>✓ Equipaje facturado: 23 kg</p>
            <p>✓ Selección de asiento incluida</p>
            <p>✓ Cambios permitidos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}