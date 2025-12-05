import { CheckCircle, Download, Home, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card, { CardContent } from '../common/Card';
import Button from '../common/Button';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

export default function PaymentSuccess({ booking, payment }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600">
            Tu reserva ha sido confirmada
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="space-y-6">
            <div className="text-center py-6 border-b">
              <div className="text-sm text-gray-500 mb-2">Referencia de Reserva</div>
              <div className="text-4xl font-bold text-primary tracking-wider">
                {booking.bookingReference}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Vuelo</div>
                <div className="font-semibold">{booking.flightNumber || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Estado</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Confirmado
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Pasajeros</div>
                <div className="font-semibold">{booking.passengers?.length || 0}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Pagado</div>
                <div className="font-bold text-lg text-primary">
                  {formatCurrency(payment.amount)}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">Detalles de los Pasajeros</h3>
              <div className="space-y-3">
                {booking.passengers?.map((passenger, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">
                        {passenger.firstName} {passenger.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {passenger.documentType}: {passenger.documentNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        Asiento {passenger.seatNumber}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                📧 Hemos enviado la confirmación y el pase de abordar a tu email.
                También puedes descargarlos desde "Mis Reservas".
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            icon={<Download className="w-5 h-5" />}
            onClick={() => window.print()}
            fullWidth
          >
            Descargar
          </Button>
          
          <Button
            variant="secondary"
            icon={<Ticket className="w-5 h-5" />}
            onClick={() => navigate('/my-bookings')}
            fullWidth
          >
            Mis Reservas
          </Button>
          
          <Button
            variant="primary"
            icon={<Home className="w-5 h-5" />}
            onClick={() => navigate('/')}
            fullWidth
          >
            Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}