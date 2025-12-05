import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plane, Calendar, Clock, MapPin, Users, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Badge, { PriceLevelBadge } from '../components/common/Badge';
import flightsApi from '../api/flightsApi';
import useBookingStore from '../store/bookingStore';
import { formatCurrency, formatTime, formatDate, formatFlightDuration } from '../utils/formatters';

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedFlight } = useBookingStore();
  const [flight, setFlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlightDetails();
  }, [id]);

  const loadFlightDetails = async () => {
    try {
      const data = await flightsApi.getFlightWithPricing(id);
      setFlight(data);
    } catch (error) {
      toast.error('Error al cargar detalles del vuelo');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = () => {
    setSelectedFlight(flight);
    navigate('/booking');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="plane" size="xl" text="Cargando vuelo..." />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vuelo no encontrado</h2>
          <Button onClick={() => navigate('/search')}>Volver a buscar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl">
        <Button
          variant="ghost"
          icon={<ArrowLeft className="w-5 h-5" />}
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          Volver
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detalles del Vuelo</CardTitle>
                  <PriceLevelBadge level={flight.priceLevel || 'MEDIUM'} />
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                      {flight.flightNumber}
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                          {formatTime(flight.departureTime)}
                        </div>
                        <div className="text-xl font-semibold">{flight.route.originAirport}</div>
                        <div className="text-gray-600">{flight.route.originCity}</div>
                        <div className="text-gray-500 text-sm mt-1">
                          {formatDate(flight.departureTime)}
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <Clock className="w-6 h-6 text-gray-400 mb-2" />
                        <div className="text-gray-600 font-semibold">
                          {formatFlightDuration(flight.route.estimatedDurationMinutes)}
                        </div>
                        <div className="w-full h-0.5 bg-gray-300 my-3 relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Plane className="w-5 h-5 text-gray-400 rotate-90" />
                          </div>
                        </div>
                        <div className="text-gray-500 text-sm">Directo</div>
                      </div>

                      <div className="text-right">
                        <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                          {formatTime(flight.arrivalTime)}
                        </div>
                        <div className="text-xl font-semibold">{flight.route.destinationAirport}</div>
                        <div className="text-gray-600">{flight.route.destinationCity}</div>
                        <div className="text-gray-500 text-sm mt-1">
                          {formatDate(flight.arrivalTime)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-6 border-t">
                    <div className="flex items-center gap-3">
                      <Plane className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Aeronave</div>
                        <div className="font-semibold">{flight.aircraft.model}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Asientos disponibles</div>
                        <div className="font-semibold">{flight.availableSeats} de {flight.aircraft.totalSeats}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Distancia</div>
                        <div className="font-semibold">{flight.route.distanceKm} km</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Estado</div>
                        <Badge variant="success">{flight.status}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Asientos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {flight.aircraft.economySeats}
                    </div>
                    <div className="text-sm text-gray-600">Económica</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {flight.aircraft.businessSeats}
                    </div>
                    <div className="text-sm text-gray-600">Ejecutiva</div>
                  </div>

                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      {flight.aircraft.firstClassSeats}
                    </div>
                    <div className="text-sm text-gray-600">Primera</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-gray-500 text-sm mb-2">Precio base</div>
                  <div className="text-gray-400 line-through text-xl">
                    {formatCurrency(flight.basePrice)}
                  </div>
                  <div className="text-5xl font-bold my-3" style={{ color: 'var(--primary)' }}>
                    {formatCurrency(flight.currentPrice || flight.basePrice)}
                  </div>
                  <div className="text-gray-600">por persona</div>
                </div>

                <div className="space-y-3 mb-6 py-6 border-y">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ocupación</span>
                    <span className="font-semibold">
                      {((flight.occupancyRate || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Equipaje incluido</span>
                    <span className="font-semibold">23 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cambios</span>
                    <span className="font-semibold">Permitidos</span>
                  </div>
                </div>

                <Button variant="primary" size="lg" fullWidth onClick={handleBookNow}>
                  Reservar Ahora
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Precio sujeto a disponibilidad. No incluye tasas aeroportuarias.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
