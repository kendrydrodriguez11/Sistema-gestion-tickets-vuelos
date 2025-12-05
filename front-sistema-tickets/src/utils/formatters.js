import { format, formatDistance, formatDuration, intervalToDuration } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear moneda
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Formatear fecha
export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
  if (!date) return '';
  return format(new Date(date), pattern, { locale: es });
};

// Formatear fecha y hora
export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), "dd/MM/yyyy 'a las' HH:mm", { locale: es });
};

// Formatear hora
export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'HH:mm', { locale: es });
};

// Formatear duración
export const formatFlightDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Formatear duración detallada
export const formatDurationDetailed = (startDate, endDate) => {
  const duration = intervalToDuration({
    start: new Date(startDate),
    end: new Date(endDate)
  });
  
  const parts = [];
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  
  return parts.join(' ');
};

// Tiempo relativo (hace X tiempo)
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale: es
  });
};

// Formatear nombre completo
export const formatFullName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(' ');
};

// Formatear número de documento
export const formatDocument = (documentNumber, documentType = 'CEDULA') => {
  if (!documentNumber) return '';
  
  if (documentType === 'CEDULA' && documentNumber.length === 10) {
    return `${documentNumber.slice(0, 3)}-${documentNumber.slice(3, 10)}-${documentNumber.slice(10)}`;
  }
  
  return documentNumber;
};

// Formatear código de vuelo
export const formatFlightCode = (flightNumber) => {
  if (!flightNumber) return '';
  return flightNumber.toUpperCase();
};

// Formatear referencia de reserva
export const formatBookingReference = (reference) => {
  if (!reference) return '';
  return reference.toUpperCase();
};

// Formatear estado de reserva
export const formatBookingStatus = (status) => {
  const statusMap = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    EXPIRED: 'Expirada'
  };
  return statusMap[status] || status;
};

// Formatear estado de pago
export const formatPaymentStatus = (status) => {
  const statusMap = {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando',
    COMPLETED: 'Completado',
    FAILED: 'Fallido',
    CANCELLED: 'Cancelado',
    REFUNDED: 'Reembolsado'
  };
  return statusMap[status] || status;
};

// Formatear método de pago
export const formatPaymentMethod = (method) => {
  const methodMap = {
    PAYPAL: 'PayPal',
    CREDIT_CARD: 'Tarjeta de Crédito',
    DEBIT_CARD: 'Tarjeta de Débito'
  };
  return methodMap[method] || method;
};

// Formatear nivel de precio
export const formatPriceLevel = (level) => {
  const levelMap = {
    LOW: 'Precio Bajo',
    MEDIUM: 'Precio Medio',
    HIGH: 'Precio Alto'
  };
  return levelMap[level] || level;
};

// Formatear clase de asiento
export const formatSeatClass = (seatClass) => {
  const classMap = {
    ECONOMY: 'Económica',
    BUSINESS: 'Ejecutiva',
    FIRST_CLASS: 'Primera Clase'
  };
  return classMap[seatClass] || seatClass;
};

// Truncar texto
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  formatFlightDuration,
  formatDurationDetailed,
  formatRelativeTime,
  formatFullName,
  formatDocument,
  formatFlightCode,
  formatBookingReference,
  formatBookingStatus,
  formatPaymentStatus,
  formatPaymentMethod,
  formatPriceLevel,
  formatSeatClass,
  truncateText
};