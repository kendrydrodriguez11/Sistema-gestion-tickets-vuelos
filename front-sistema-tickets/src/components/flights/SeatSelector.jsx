import { useState } from 'react';
import toast from 'react-hot-toast';
import Badge from '../common/Badge';
import useBookingStore from '../../store/bookingStore';

export default function SeatSelector({ availableSeats }) {
  const { selectedSeats, addSeat, removeSeat } = useBookingStore();
  const [filter, setFilter] = useState('ALL');

  const handleSeatClick = (seat) => {
    if (seat.status !== 'AVAILABLE') {
      toast.error('Este asiento no está disponible');
      return;
    }

    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber);

    if (isSelected) {
      removeSeat(seat.seatNumber);
      toast.success(`Asiento ${seat.seatNumber} removido`);
    } else {
      if (selectedSeats.length >= 9) {
        toast.error('Máximo 9 asientos por reserva');
        return;
      }
      addSeat(seat);
      toast.success(`Asiento ${seat.seatNumber} seleccionado`);
    }
  };

  const getSeatColor = (seat) => {
    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber);

    if (isSelected) return 'bg-green-500 text-white hover:bg-green-600';
    if (seat.status === 'RESERVED' || seat.status === 'OCCUPIED') {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }

    switch (seat.seatClass) {
      case 'FIRST_CLASS':
        return 'bg-amber-100 hover:bg-amber-200 text-amber-800';
      case 'BUSINESS':
        return 'bg-purple-100 hover:bg-purple-200 text-purple-800';
      default:
        return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
    }
  };

  const filteredSeats = filter === 'ALL'
    ? availableSeats
    : availableSeats.filter(seat => seat.seatClass === filter);

  // Agrupar asientos por fila
  const seatsByRow = filteredSeats.reduce((acc, seat) => {
    const row = seat.seatNumber.replace(/[A-F]/g, '');
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Leyenda */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded border-2 border-blue-300"></div>
          <span className="text-sm">Económica</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded border-2 border-purple-300"></div>
          <span className="text-sm">Ejecutiva</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 rounded border-2 border-amber-300"></div>
          <span className="text-sm">Primera</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded"></div>
          <span className="text-sm">Seleccionado</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'ALL' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('ECONOMY')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'ECONOMY' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Económica
        </button>
        <button
          onClick={() => setFilter('BUSINESS')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'BUSINESS' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Ejecutiva
        </button>
        <button
          onClick={() => setFilter('FIRST_CLASS')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'FIRST_CLASS' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Primera
        </button>
      </div>

      {/* Selección actual */}
      {selectedSeats.length > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="font-semibold text-green-800 mb-2">
            Asientos Seleccionados ({selectedSeats.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seat => (
              <Badge key={seat.seatNumber} variant="success">
                {seat.seatNumber}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Mapa de asientos */}
      <div className="bg-gray-50 rounded-xl p-6">
        {/* Cockpit */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-gray-300 to-gray-400 text-white px-8 py-3 rounded-t-full font-semibold">
            ✈️ Cabina
          </div>
        </div>

        {/* Asientos */}
        <div className="space-y-2 max-w-md mx-auto">
          {Object.keys(seatsByRow)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(row => (
              <div key={row} className="flex items-center gap-2">
                <div className="w-8 text-center font-semibold text-gray-500">
                  {row}
                </div>

                <div className="flex gap-1 flex-1 justify-center">
                  {seatsByRow[row]
                    .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
                    .map((seat, index) => (
                      <div key={seat.id} className="flex gap-1">
                        <button
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status !== 'AVAILABLE'}
                          className={`
                            w-12 h-12 rounded-lg font-bold text-sm
                            transition-all duration-200 transform
                            ${getSeatColor(seat)}
                            ${seat.status === 'AVAILABLE' ? 'hover:scale-110' : ''}
                            disabled:cursor-not-allowed
                          `}
                        >
                          {seat.seatNumber.slice(-1)}
                        </button>
                        {/* Pasillo después de C */}
                        {seat.seatNumber.endsWith('C') && (
                          <div className="w-4"></div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}