// Aeropuertos principales de Ecuador
export const AIRPORTS = [
  { code: 'GYE', name: 'Guayaquil - José Joaquín de Olmedo', city: 'Guayaquil' },
  { code: 'UIO', name: 'Quito - Mariscal Sucre', city: 'Quito' },
  { code: 'CUE', name: 'Cuenca - Mariscal Lamar', city: 'Cuenca' },
  { code: 'MEC', name: 'Manta - Eloy Alfaro', city: 'Manta' },
  { code: 'LOH', name: 'Loja - Ciudad de Catamayo', city: 'Loja' },
  { code: 'GPS', name: 'Galápagos - Seymour', city: 'Galápagos' },
  { code: 'XMS', name: 'Macas - Edmundo Carvajal', city: 'Macas' },
  { code: 'ESM', name: 'Esmeraldas - Carlos Concha Torres', city: 'Esmeraldas' },
];

// Tipos de documento
export const DOCUMENT_TYPES = [
  { value: 'CEDULA', label: 'Cédula de Identidad' },
  { value: 'PASSPORT', label: 'Pasaporte' },
  { value: 'RUC', label: 'RUC' },
];

// Estados de reserva
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

// Estados de pago
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

// Métodos de pago
export const PAYMENT_METHODS = {
  PAYPAL: 'PAYPAL',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD'
};

// Clases de asiento
export const SEAT_CLASSES = {
  ECONOMY: 'ECONOMY',
  BUSINESS: 'BUSINESS',
  FIRST_CLASS: 'FIRST_CLASS'
};

// Estados de asiento
export const SEAT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  OCCUPIED: 'OCCUPIED',
  BLOCKED: 'BLOCKED'
};

// Niveles de precio
export const PRICE_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

// Colores para estados
export const STATUS_COLORS = {
  PENDING: 'warning',
  PROCESSING: 'info',
  CONFIRMED: 'success',
  COMPLETED: 'success',
  CANCELLED: 'error',
  FAILED: 'error',
  EXPIRED: 'error',
  REFUNDED: 'info'
};

// Iconos para tipos de vuelo
export const FLIGHT_ICONS = {
  DOMESTIC: '🛫',
  INTERNATIONAL: '✈️',
  CHARTER: '🛩️'
};

// Límites de la aplicación
export const APP_LIMITS = {
  MAX_PASSENGERS: 9,
  MIN_PASSENGERS: 1,
  MAX_BOOKING_DURATION_MINUTES: 15,
  MIN_BOOKING_ADVANCE_DAYS: 0,
  MAX_BOOKING_ADVANCE_DAYS: 365
};

// Monedas soportadas
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
  FLIGHT_DETAILS: '/flight/:id',
  BOOKING: '/booking',
  PAYMENT: '/payment',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_CANCEL: '/payment/cancel',
  MY_BOOKINGS: '/my-bookings',
  BOOKING_DETAILS: '/booking/:id',
  PROFILE: '/profile'
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  AUTH_ERROR: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  BOOKING_EXPIRED: 'El tiempo para completar la reserva ha expirado.',
  SEAT_UNAVAILABLE: 'El asiento seleccionado ya no está disponible.',
  PAYMENT_FAILED: 'El pago no pudo ser procesado. Por favor, intenta nuevamente.'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: '¡Reserva creada exitosamente!',
  BOOKING_CONFIRMED: '¡Tu reserva ha sido confirmada!',
  PAYMENT_COMPLETED: '¡Pago completado exitosamente!',
  PROFILE_UPDATED: 'Perfil actualizado correctamente.',
  BOOKING_CANCELLED: 'Reserva cancelada correctamente.'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [10, 20, 50, 100]
};

export default {
  AIRPORTS,
  DOCUMENT_TYPES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  SEAT_CLASSES,
  SEAT_STATUS,
  PRICE_LEVELS,
  STATUS_COLORS,
  FLIGHT_ICONS,
  APP_LIMITS,
  CURRENCIES,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION
};