import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Componente Input reutilizable
 * @param {string} label - Etiqueta del input
 * @param {string} error - Mensaje de error
 * @param {string} helperText - Texto de ayuda
 * @param {boolean} required - Campo requerido
 * @param {React.ReactNode} icon - Icono a mostrar
 * @param {string} iconPosition - 'left' | 'right'
 * @param {boolean} fullWidth - Ocupa todo el ancho
 * @param {string} className - Clases CSS adicionales
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  type = 'text',
  id,
  name,
  ...props
}, ref) => {
  const inputId = id || name;
  
  const baseInputClasses = `
    w-full px-4 py-2.5 
    border-2 rounded-lg 
    text-gray-900 placeholder-gray-400
    transition-all duration-200
    focus:outline-none focus:ring-2
  `;
  
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
  
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : '';
  
  const inputClasses = `${baseInputClasses} ${stateClasses} ${iconClasses} ${className}`.trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
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

Input.displayName = 'Input';

export default Input;