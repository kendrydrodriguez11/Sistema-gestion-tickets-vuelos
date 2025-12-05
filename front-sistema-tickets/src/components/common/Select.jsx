import React, { forwardRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

/**
 * Componente Select reutilizable
 * @param {string} label - Etiqueta del select
 * @param {string} error - Mensaje de error
 * @param {string} helperText - Texto de ayuda
 * @param {boolean} required - Campo requerido
 * @param {Array} options - Opciones del select [{value, label}]
 * @param {string} placeholder - Texto placeholder
 * @param {boolean} fullWidth - Ocupa todo el ancho
 * @param {string} className - Clases CSS adicionales
 */
const Select = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  options = [],
  placeholder = 'Seleccionar...',
  fullWidth = true,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const selectId = id || name;
  
  const baseSelectClasses = `
    w-full px-4 py-2.5 pr-10
    border-2 rounded-lg 
    text-gray-900
    transition-all duration-200
    appearance-none
    focus:outline-none focus:ring-2
    bg-white
  `;
  
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
  
  const selectClasses = `${baseSelectClasses} ${stateClasses} ${className}`.trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option, index) => (
            <option 
              key={option.value || index} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {error ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p className="mt-1.5 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;