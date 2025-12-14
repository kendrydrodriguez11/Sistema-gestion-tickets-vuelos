import { Plane, Calendar, Users, TrendingDown } from 'lucide-react';
import Card from '../common/Card';
import Badge, { PriceLevelBadge } from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency, formatTime, formatFlightDuration } from '../../utils/formatters';

export default function FlightCard({ flight, onSelect }) {
  const isLowPrice = flight.priceLevel === 'LOW';

  // ✅ Manejar ambas estructuras de datos (búsqueda vs detalle)
  const getRouteData = () => {
    if (flight.route) {
      // Estructura de FlightDto (con objeto route anidado)
      return {
        originAirport: flight.route.originAirport,
        destinationAirport: flight.route.destinationAirport,
        originCity: flight.route.originCity,
        destinationCity: flight.route.destinationCity,
        estimatedDurationMinutes: flight.route.estimatedDurationMinutes
      };
    } else {
      // Estructura de FlightSearchResponseDto (campos directos)
      return {
        originAirport: flight.originAirport,
        destinationAirport: flight.destinationAirport,
        originCity: flight.originCity,
        destinationCity: flight.destinationCity,
        estimatedDurationMinutes: flight.durationMinutes
      };
    }
  };

  const getAircraftData = () => {
    if (flight.aircraft) {
      // Estructura de FlightDto (con objeto aircraft anidado)
      return {
        model: flight.aircraft.model,
        manufacturer: flight.aircraft.manufacturer,
        totalSeats: flight.aircraft.totalSeats
      };
    } else {
      // Estructura de FlightSearchResponseDto (campos directos)
      return {
        model: flight.aircraftModel,
        manufacturer: flight.aircraftManufacturer,
        totalSeats: flight.totalSeats
      };
    }
  };

  const route = getRouteData();
  const aircraft = getAircraftData();

  return (
    <Card 
      hover 
      className="border border-gray-200 hover:border-primary transition-all overflow-hidden cursor-pointer"
      onClick={onSelect}
    >
      <div className="grid md:grid-cols-3 gap-8 items-center p-6">
        {/* Información del vuelo */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{flight.flightNumber}</h3>
              <p className="text-sm text-gray-500">{aircraft.model}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {/* Salida */}
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatTime(flight.departureTime)}
              </div>
              <div className="text-sm font-semibold text-gray-900">{route.originAirport}</div>
              <div className="text-xs text-gray-600">{route.originCity}</div>
            </div>

            {/* Duración */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-gray-600 mb-2 font-medium">
                {formatFlightDuration(route.estimatedDurationMinutes)}
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-primary to-primary/50 relative rounded-full">
                <Plane className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" style={{transform: 'translate(-50%, -50%) rotate(90deg)'}} />
              </div>
              <div className="text-xs text-gray-600 mt-2 font-medium">Directo</div>
            </div>

            {/* Llegada */}
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatTime(flight.arrivalTime)}
              </div>
              <div className="text-sm font-semibold text-gray-900">{route.destinationAirport}</div>
              <div className="text-xs text-gray-600">{route.destinationCity}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {new Date(flight.departureTime).toLocaleDateString('es-EC', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              {flight.availableSeats} asientos
            </div>
          </div>
        </div>

        {/* Precio y acción */}
        <div className="md:col-span-1 text-center md:text-right">
          <div className="mb-3">
            {isLowPrice && (
              <Badge variant="success" className="animate-pulse mb-2">
                <TrendingDown className="w-3 h-3" />
                Oferta
              </Badge>
            )}
            <div className="text-xs text-gray-500 mb-1">Desde</div>
            <div className="text-gray-400 line-through text-sm">
              {formatCurrency(flight.basePrice)}
            </div>
          </div>

          <div className="text-4xl font-bold text-primary mb-1">
            {formatCurrency(flight.currentPrice)}
          </div>
          <div className="text-sm text-gray-600 mb-4">por persona</div>

          <Button
            variant="primary"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            Seleccionar
          </Button>

          <p className="text-xs text-gray-500 mt-3">
            Equipaje incluido
          </p>
        </div>
      </div>
    </Card>
  );
}