// Validar email
export const validateEmail = (email) => {
  if (!email) return 'El email es requerido';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'El formato del email no es válido';
  return null;
};

// Validar contraseña
export const validatePassword = (password) => {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  if (password.length > 100) return 'La contraseña es demasiado larga';
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  if (!hasLetter || !hasNumber) return 'La contraseña debe contener al menos una letra y un número';
  return null;
};

// Validar confirmación de contraseña
export const validatePasswordConfirmation = (password, confirmation) => {
  if (!confirmation) return 'Debes confirmar tu contraseña';
  if (password !== confirmation) return 'Las contraseñas no coinciden';
  return null;
};

// Validar username
export const validateUsername = (username) => {
  if (!username) return 'El nombre de usuario es requerido';
  if (username.length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres';
  if (username.length > 50) return 'El nombre de usuario es demasiado largo';
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) return 'El nombre de usuario solo puede contener letras, números y guiones bajos';
  return null;
};

// Validar nombre
export const validateName = (name, fieldName = 'nombre') => {
  if (!name) return `El ${fieldName} es requerido`;
  if (name.length < 2) return `El ${fieldName} debe tener al menos 2 caracteres`;
  if (name.length > 100) return `El ${fieldName} es demasiado largo`;
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name)) return `El ${fieldName} solo puede contener letras`;
  return null;
};

// Validar teléfono
export const validatePhone = (phone) => {
  if (!phone) return null;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^\d{7,15}$/;
  if (!phoneRegex.test(cleanPhone)) return 'El número de teléfono no es válido (7-15 dígitos)';
  return null;
};

// Validar cédula ecuatoriana
export const validateEcuadorianId = (cedula) => {
  if (!cedula) return 'La cédula es requerida';
  const cleanCedula = cedula.replace(/[\s-]/g, '');
  if (cleanCedula.length !== 10) return 'La cédula debe tener 10 dígitos';
  if (!/^\d+$/.test(cleanCedula)) return 'La cédula solo puede contener números';
  const provincia = parseInt(cleanCedula.substring(0, 2));
  if (provincia < 1 || provincia > 24) return 'Código de provincia inválido';
  const digits = cleanCedula.split('').map(Number);
  const verificador = digits[9];
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let digit = digits[i];
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    suma += digit;
  }
  const residuo = suma % 10;
  const digitoCalculado = residuo === 0 ? 0 : 10 - residuo;
  if (digitoCalculado !== verificador) return 'Número de cédula inválido';
  return null;
};

// Validar pasaporte
export const validatePassport = (passport) => {
  if (!passport) return 'El pasaporte es requerido';
  const cleanPassport = passport.replace(/\s/g, '');
  if (cleanPassport.length < 6 || cleanPassport.length > 9) return 'El pasaporte debe tener entre 6 y 9 caracteres';
  const passportRegex = /^[A-Z0-9]+$/i;
  if (!passportRegex.test(cleanPassport)) return 'El pasaporte solo puede contener letras y números';
  return null;
};

// Validar documento según tipo
export const validateDocument = (documentNumber, documentType) => {
  if (!documentNumber) return 'El número de documento es requerido';
  switch (documentType) {
    case 'CEDULA':
      return validateEcuadorianId(documentNumber);
    case 'PASSPORT':
      return validatePassport(documentNumber);
    case 'RUC':
      if (!/^\d{13}$/.test(documentNumber)) return 'El RUC debe tener 13 dígitos';
      return null;
    default:
      return 'Tipo de documento no válido';
  }
};

// Validar fecha
export const validateDate = (date, fieldName = 'fecha') => {
  if (!date) return `La ${fieldName} es requerida`;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `La ${fieldName} no es válida`;
  return null;
};

// Validar fecha de nacimiento
export const validateDateOfBirth = (date) => {
  if (!date) return 'La fecha de nacimiento es requerida';
  const birthDate = new Date(date);
  if (isNaN(birthDate.getTime())) return 'La fecha de nacimiento no es válida';
  const today = new Date();
  if (birthDate > today) return 'La fecha de nacimiento no puede ser futura';
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 0 || age > 120) return 'La fecha de nacimiento no es válida';
  return null;
};

// Validar fecha de vuelo
export const validateFlightDate = (date) => {
  if (!date) return 'La fecha de vuelo es requerida';
  const flightDate = new Date(date);
  if (isNaN(flightDate.getTime())) return 'La fecha de vuelo no es válida';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (flightDate < today) return 'La fecha de vuelo no puede ser en el pasado';
  const oneYearFromNow = new Date(); oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  if (flightDate > oneYearFromNow) return 'La fecha de vuelo no puede ser más de 1 año en el futuro';
  return null;
};

// Validar rango de fechas
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Ambas fechas son requeridas';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Las fechas no son válidas';
  if (end < start) return 'La fecha de regreso debe ser posterior a la fecha de ida';
  return null;
};

// Validar número de pasajeros
export const validatePassengers = (passengers) => {
  if (!passengers) return 'El número de pasajeros es requerido';
  const num = parseInt(passengers);
  if (isNaN(num)) return 'El número de pasajeros debe ser un número';
  if (num < 1) return 'Debe haber al menos 1 pasajero';
  if (num > 9) return 'El número máximo de pasajeros es 9';
  return null;
};

// Validar código IATA
export const validateAirportCode = (code, fieldName = 'aeropuerto') => {
  if (!code) return `El código de ${fieldName} es requerido`;
  const codeRegex = /^[A-Z]{3}$/;
  if (!codeRegex.test(code)) return `El código de ${fieldName} debe tener 3 letras`;
  return null;
};

// Validar origen y destino
export const validateOriginDestination = (origin, destination) => {
  if (!origin || !destination) return 'Debes seleccionar origen y destino';
  if (origin === destination) return 'El origen y destino deben ser diferentes';
  return null;
};

// Validar montos
export const validateAmount = (amount, fieldName = 'monto') => {
  if (!amount && amount !== 0) return `El ${fieldName} es requerido`;
  const num = parseFloat(amount);
  if (isNaN(num)) return `El ${fieldName} debe ser un número`;
  if (num < 0) return `El ${fieldName} no puede ser negativo`;
  if (num === 0) return `El ${fieldName} debe ser mayor a 0`;
  if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) return `El ${fieldName} solo puede tener hasta 2 decimales`;
  return null;
};

// Validar requeridos
export const validateRequired = (value, fieldName = 'campo') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) return `El ${fieldName} es requerido`;
  return null;
};

// Validar longitud
export const validateLength = (value, min, max, fieldName = 'campo') => {
  if (!value) return `El ${fieldName} es requerido`;
  if (value.length < min) return `El ${fieldName} debe tener al menos ${min} caracteres`;
  if (value.length > max) return `El ${fieldName} no puede tener más de ${max} caracteres`;
  return null;
};

// Validar formulario
export const validateForm = (values, rules) => {
  const errors = {};
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = values[field];
    if (typeof rule === 'function') {
      const error = rule(value, values);
      if (error) errors[field] = error;
    } else if (Array.isArray(rule)) {
      for (const validator of rule) {
        const error = validator(value, values);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
  });
  return { isValid: Object.keys(errors).length === 0, errors };
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateUsername,
  validateName,
  validatePhone,
  validateEcuadorianId,
  validatePassport,
  validateDocument,
  validateDate,
  validateDateOfBirth,
  validateFlightDate,
  validateDateRange,
  validatePassengers,
  validateAirportCode,
  validateOriginDestination,
  validateAmount,
  validateRequired,
  validateLength,
  validateForm
};
