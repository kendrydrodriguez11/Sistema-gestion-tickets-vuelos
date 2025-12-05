import { useState } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import Alert from '../common/Alert';
import { PAYMENT_METHODS } from '../../utils/constants';

export default function PaymentForm({ onSubmit, isLoading }) {
  const [paymentMethod, setPaymentMethod] = useState('PAYPAL');

  const paymentMethodOptions = [
    { value: 'PAYPAL', label: '💳 PayPal' },
    { value: 'CREDIT_CARD', label: '💳 Tarjeta de Crédito' },
    { value: 'DEBIT_CARD', label: '💳 Tarjeta de Débito' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(paymentMethod);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Método de Pago
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Select
            label="Selecciona tu método de pago"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={paymentMethodOptions}
            required
          />

          {paymentMethod === 'PAYPAL' && (
            <Alert variant="info" title="Pago con PayPal">
              Serás redirigido a PayPal para completar tu pago de forma segura.
            </Alert>
          )}

          {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
            <Alert variant="warning" title="Próximamente">
              El pago con tarjeta estará disponible próximamente. Por favor, usa PayPal.
            </Alert>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Información importante:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Tu reserva expira en 15 minutos</li>
                  <li>El pago es procesado de forma segura</li>
                  <li>Recibirás confirmación por email</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={paymentMethod !== 'PAYPAL'}
          >
            Proceder al Pago
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}