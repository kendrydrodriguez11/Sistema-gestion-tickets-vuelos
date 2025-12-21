import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import PaymentForm from '../components/payment/PaymentForm';
import BookingSummary from '../components/booking/BookingSummary';
import Spinner from '../components/common/Spinner';
import useBookingStore from '../store/bookingStore';
import useAuthStore from '../store/authStore';
import paymentsApi from '../api/paymentsApi';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bookingData, selectedFlight, resetBooking } = useBookingStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (!bookingData) {
      toast.error('No hay datos de reserva');
      navigate('/booking');
      return;
    }

    // Calcular tiempo restante
    const calculateTimeRemaining = () => {
      const expiresAt = new Date(bookingData.expiresAt);
      const now = new Date();
      const diff = expiresAt - now;

      if (diff <= 0) {
        toast.error('Tu reserva ha expirado');
        navigate('/search');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining({ minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [bookingData, navigate]);

  const handlePayment = async (paymentMethod) => {
  if (!bookingData) {
    toast.error('No hay datos de reserva');
    return;
  }

  // 🔥 FIX: Calcular el precio si no existe en bookingData
  let totalAmount = bookingData.totalPrice;
  
  if (!totalAmount || totalAmount <= 0) {
    if (selectedFlight && selectedFlight.currentPrice) {
      const passengers = bookingData.passengers?.length || 1;
      totalAmount = selectedFlight.currentPrice * passengers;
    } else if (selectedFlight && selectedFlight.basePrice) {
      const passengers = bookingData.passengers?.length || 1;
      totalAmount = selectedFlight.basePrice * passengers;
    } else {
      toast.error('No se pudo calcular el monto total');
      return;
    }
  }

  // ✅ Validar que el monto sea válido antes de enviar
  if (!totalAmount || totalAmount <= 0) {
    toast.error('El monto del pago debe ser mayor a 0');
    console.error('Invalid amount:', totalAmount, bookingData);
    return;
  }

  console.log('💰 Iniciando pago con monto:', totalAmount);

  setIsProcessing(true);

  try {
    const paymentData = {
      bookingId: bookingData.id,
      amount: totalAmount, // ✅ Usar el monto calculado
      currency: 'USD',
      method: paymentMethod,
      returnUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancel`
    };

    console.log('📤 Enviando pago:', paymentData);

    const payment = await paymentsApi.initiatePayment(paymentData, user.id);

    if (payment.approvalUrl) {
      window.location.href = payment.approvalUrl;
    } else {
      toast.success('Pago iniciado correctamente');
      navigate('/payment/success');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al procesar el pago';
    toast.error(errorMessage);
    console.error('Payment error:', error);
  } finally {
    setIsProcessing(false);
  }
};  

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="plane" size="xl" text="Cargando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/booking')}
            className="mb-4"
          >
            Volver
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Completar Pago
          </h1>
          <p className="text-gray-600">
            Finaliza tu reserva realizando el pago seguro
          </p>
        </div>

        {/* Alerta de tiempo */}
        {timeRemaining && (
          <Alert 
            variant="warning" 
            title="⏰ Tiempo Limitado"
            className="mb-6"
          >
            Tu reserva expira en{' '}
            <strong>
              {timeRemaining.minutes}:{timeRemaining.seconds.toString().padStart(2, '0')}
            </strong>
            {' '}minutos. Completa el pago antes de que expire.
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario de pago */}
          <div className="lg:col-span-2">
            <PaymentForm 
              onSubmit={handlePayment} 
              isLoading={isProcessing}
            />

            {/* Información de seguridad */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Pago Seguro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <p>
                      Todos los pagos son procesados de forma segura mediante 
                      encriptación SSL de 256 bits
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <p>
                      Tus datos financieros nunca son almacenados en nuestros 
                      servidores
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <p>
                      Cumplimos con los estándares PCI DSS para protección de 
                      datos de tarjetas
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <p>
                      Recibirás confirmación inmediata por email una vez 
                      completado el pago
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles de la reserva */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Detalles de la Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Referencia de Reserva
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {bookingData.bookingReference}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Fecha de Creación
                      </div>
                      <div className="font-semibold">
                        {formatDate(bookingData.createdAt)} a las{' '}
                        {formatTime(bookingData.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500 mb-2">
                      Pasajeros ({bookingData.passengers?.length || 0})
                    </div>
                    <div className="space-y-2">
                      {bookingData.passengers?.map((passenger, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
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

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        {formatCurrency(bookingData.totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Tasas e impuestos</span>
                      <span className="font-semibold">{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-bold text-lg">Total a Pagar</span>
                      <span className="font-bold text-3xl text-primary">
                        {formatCurrency(bookingData.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen */}
          <div>
            <BookingSummary />

            {/* Información adicional */}
            <Card className="mt-6">
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">
                        Confirmación Inmediata
                      </div>
                      <div className="text-gray-600">
                        Recibirás tu pase de abordar por email inmediatamente 
                        después del pago
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">
                        Métodos de Pago
                      </div>
                      <div className="text-gray-600">
                        Aceptamos PayPal, tarjetas de crédito y débito
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">
                        Cancelación Flexible
                      </div>
                      <div className="text-gray-600">
                        Cancela hasta 24 horas antes del vuelo sin cargos
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}