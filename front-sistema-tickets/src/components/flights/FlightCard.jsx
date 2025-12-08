import { Plane, Calendar, Users, TrendingDown } from 'lucide-react';
import Card from '../common/Card';
import Badge, { PriceLevelBadge } from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency, formatTime, formatFlightDuration } from '../../utils/formatters';

export default function FlightCard({ flight, onSelect }) {
  const isLowPrice = flight.priceLevel === 'LOW';

  return (
    <Card 
      hover 
      clickable 
      onClick={onSelect} 
      className="border border-gray-200 hover:border-primary transition-all overflow-hidden"
    >
      <div className="grid md:grid-cols-12 gap-6 items-center p-6">
        {/* Información del vuelo */}
        <div className="md:col-span-7">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{flight.flightNumber}</h3>
              <p className="text-sm text-gray-500">{flight.aircraftModel}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {/* Salida */}
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatTime(flight.departureTime)}
              </div>
              <div className="text-sm font-semibold text-gray-900">{flight.route.originAirport}</div>
              <div className="text-xs text-gray-600">{flight.route.originCity}</div>
            </div>

            {/* Duración */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-gray-600 mb-2 font-medium">
                {formatFlightDuration(flight.durationMinutes)}
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
              <div className="text-sm font-semibold text-gray-900">{flight.route.destinationAirport}</div>
              <div className="text-xs text-gray-600">{flight.route.destinationCity}</div>
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
        <div className="md:col-span-5 border-l border-gray-100 pl-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Desde</div>
              <div className="text-gray-400 line-through text-sm">
                {formatCurrency(flight.basePrice)}
              </div>
            </div>
            {isLowPrice && (
              <Badge variant="success" className="animate-pulse">
                <TrendingDown className="w-3 h-3" />
                Oferta
              </Badge>
            )}
          </div>

          <div className="text-4xl font-bold text-primary mb-2">
            {formatCurrency(flight.currentPrice)}
          </div>
          <div className="text-sm text-gray-600 mb-6">por persona</div>

          <Button
            variant="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-full"
          >
            Seleccionar Vuelo
          </Button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Equipaje incluido • Cambios permitidos
          </p>
        </div>
      </div>
    </Card>
  );
}