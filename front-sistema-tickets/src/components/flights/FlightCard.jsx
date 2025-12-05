import { Plane, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Badge, { PriceLevelBadge } from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency, formatTime, formatFlightDuration } from '../../utils/formatters';

export default function FlightCard({ flight, onSelect }) {
  return (
    <Card hover clickable onClick={onSelect} padding="lg">
      <div className="grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {flight.flightNumber}
            </h3>
            <PriceLevelBadge level={flight.priceLevel} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
                {formatTime(flight.departureTime)}
              </div>
              <div className="text-gray-900 font-semibold">{flight.originAirport}</div>
              <div className="text-gray-600 text-sm">{flight.originCity}</div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="text-gray-600 text-sm mb-2">
                {formatFlightDuration(flight.durationMinutes)}
              </div>
              <div className="w-full h-0.5 bg-gray-300 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Plane className="w-5 h-5 text-gray-400 rotate-90" />
                </div>
              </div>
              <div className="text-gray-500 text-xs mt-2">Vuelo directo</div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
                {formatTime(flight.arrivalTime)}
              </div>
              <div className="text-gray-900 font-semibold">{flight.destinationAirport}</div>
              <div className="text-gray-600 text-sm">{flight.destinationCity}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(flight.departureTime).toLocaleDateString('es-EC')}
            </span>
            <span className="flex items-center gap-1">
              <Plane className="w-4 h-4" />
              {flight.aircraftModel}
            </span>
            <span>
              {flight.availableSeats} asientos disponibles
            </span>
          </div>
        </div>

        <div className="md:col-span-4 text-center md:text-right border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
          <div className="mb-2">
            <span className="text-gray-500 text-sm line-through">
              {formatCurrency(flight.basePrice)}
            </span>
          </div>
          <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
            {formatCurrency(flight.currentPrice)}
          </div>
          <div className="text-gray-600 text-sm mb-4">por persona</div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            Seleccionar
          </Button>
        </div>
      </div>
    </Card>
  );
}
