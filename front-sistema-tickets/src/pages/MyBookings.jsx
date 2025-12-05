import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Plane, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { StatusBadge } from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import { NoResults } from '../components/common/EmptyState';
import bookingsApi from '../api/bookingsApi';
import useAuthStore from '../store/authStore';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingsApi.getUserBookings(user.id);
      setBookings(response.content || []);
    } catch (error) {
      toast.error('Error al cargar las reservas');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="plane" size="xl" text="Cargando reservas..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
          <p className="text-gray-600">Gestiona tus reservas y pases de abordar</p>
        </div>

        {/* Búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Buscar por referencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />

            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'ALL' ? 'primary' : 'outline'}
                onClick={() => setFilterStatus('ALL')}
                size="sm"
              >
                Todas
              </Button>
              <Button
                variant={filterStatus === 'CONFIRMED' ? 'primary' : 'outline'}
                onClick={() => setFilterStatus('CONFIRMED')}
                size="sm"
              >
                Confirmadas
              </Button>
              <Button
                variant={filterStatus === 'PENDING' ? 'primary' : 'outline'}
                onClick={() => setFilterStatus('PENDING')}
                size="sm"
              >
                Pendientes
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de reservas */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} hover>
                <CardContent>
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-primary">
                          {booking.bookingReference}
                        </h3>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Fecha de reserva</div>
                            <div className="font-semibold">{formatDate(booking.createdAt)}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Ticket className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Pasajeros</div>
                            <div className="font-semibold">{booking.passengers?.length || 0}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Plane className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Vuelo</div>
                            <div className="font-semibold">{booking.flightNumber || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 text-center md:text-right border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {formatCurrency(booking.totalPrice)}
                      </div>
                      <div className="text-gray-500 text-sm mb-4">Total pagado</div>

                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => navigate(`/booking/${booking.id}`)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <NoResults
            searchTerm={searchTerm}
            onReset={() => {
              setSearchTerm('');
              setFilterStatus('ALL');
            }}
          />
        )}
      </div>
    </div>
  );
}