import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home, Ticket, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Card, { CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import useBookingStore from '../store/bookingStore';
import paymentsApi from '../api/paymentsApi';
import bookingsApi from '../api/bookingsApi';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookingData, resetBooking } = useBookingStore();
  const [isLoading, setIsLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      const paypalOrderId = searchParams.get('token');

      if (!paypalOrderId) {
        toast.error('No se encontró información del pago');
        navigate('/search');
        return;
      }

      try {
        // Capturar el pago de PayPal
        const capturedPayment = await paymentsApi.capturePayment(paypalOrderId);
        setPayment(capturedPayment);

        // Obtener detalles de la reserva
        if (capturedPayment.bookingId) {
          const bookingDetails = await bookingsApi.getBooking(capturedPayment.bookingId);
          setBooking(bookingDetails);
        } else if (bookingData) {
          setBooking(bookingData);
        }

        toast.success('¡Pago procesado exitosamente!');
      } catch (error) {
        toast.error('Error al procesar el pago');
        console.error('Payment capture error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    processPayment();

    // Limpiar el estado de reserva después de un pago exitoso
    return () => {
      if (!isLoading && payment) {
        resetBooking();
      }
    };
  }, [searchParams, navigate]);

  const handleDownloadTicket = () => {
    window.print();
    toast.success('Preparando descarga...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner variant="plane" size="xl" text="Procesando pago..." />
      </div>
    );
  }

  if (!payment || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">
              No se encontró información del pago
            </h2>
            <Button onClick={() => navigate('/')}>
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl">
        {/* Icono de éxito */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            ¡Pago Exitoso!
          </h1>
          <p className="text-xl text-gray-600">
            Tu reserva ha sido confirmada correctamente
          </p>
        </div>

        {/* Detalles de la reserva */}
        <Card className="mb-6 print:shadow-none">
          <CardContent className="space-y-6">
            {/* Referencia */}
            <div className="text-center py-6 border-b border-gray-200">
              <div className="text-sm text-gray-500 mb-2">
                Código de Referencia
              </div>
              <div className="text-5xl font-bold text-primary tracking-wider mb-2">
                {booking.bookingReference}
              </div>
              <div className="text-sm text-gray-600">
                Guarda este código para consultar tu reserva
              </div>
            </div>

            {/* Información principal */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Estado</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Confirmado
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Pasajeros</div>
                <div className="text-2xl font-bold text-gray-900">
                  {booking.passengers?.length || 0}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Total Pagado</div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(payment.amount)}
                </div>
              </div>
            </div>

            {/* Información del vuelo */}
            {booking.flightId && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-lg mb-4">
                  Detalles del Vuelo
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Número de Vuelo
                    </div>
                    <div className="font-semibold">
                      {booking.flightNumber || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Fecha de Reserva
                    </div>
                    <div className="font-semibold">
                      {formatDate(booking.confirmedAt || booking.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pasajeros */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Pasajeros</h3>
              <div className="space-y-3">
                {booking.passengers?.map((passenger, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold text-lg">
                        {passenger.firstName} {passenger.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {passenger.documentType}: {passenger.documentNumber}
                      </div>
                      {passenger.dateOfBirth && (
                        <div className="text-sm text-gray-500">
                          Nacimiento: {formatDate(passenger.dateOfBirth)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary text-lg">
                        {passenger.seatNumber}
                      </div>
                      <div className="text-sm text-gray-600">Asiento</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Información de pago */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-lg mb-4">
                Información de Pago
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Método de Pago
                  </div>
                  <div className="font-semibold">💳 {payment.method}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    ID de Transacción
                  </div>
                  <div className="font-mono text-sm">
                    {payment.paypalOrderId?.substring(0, 20)}...
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Fecha de Pago
                  </div>
                  <div className="font-semibold">
                    {formatDate(payment.completedAt)} a las{' '}
                    {formatTime(payment.completedAt)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Moneda</div>
                  <div className="font-semibold">{payment.currency}</div>
                </div>
              </div>
            </div>

            {/* Mensaje importante */}
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">
                      Confirmación Enviada
                    </p>
                    <p>
                      Hemos enviado la confirmación de tu reserva y el pase 
                      de abordar a tu correo electrónico. También puedes 
                      descargarlos desde la sección "Mis Reservas".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="grid md:grid-cols-3 gap-4 print:hidden">
          <Button
            variant="outline"
            icon={<Download className="w-5 h-5" />}
            onClick={handleDownloadTicket}
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
            Volver al Inicio
          </Button>
        </div>

        {/* Información adicional */}
        <Card className="mt-6 print:hidden">
          <CardContent>
            <h3 className="font-semibold text-lg mb-4">
              Próximos Pasos
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  1
                </div>
                <p>
                  Revisa tu correo electrónico para ver los detalles 
                  completos de tu reserva y el pase de abordar
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  2
                </div>
                <p>
                  Llega al aeropuerto con al menos 2 horas de anticipación 
                  para vuelos nacionales
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  3
                </div>
                <p>
                  Presenta tu documento de identidad y el código de reserva 
                  en el counter de la aerolínea
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                  4
                </div>
                <p>
                  Si necesitas hacer cambios o cancelar, visita la sección 
                  "Mis Reservas"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}