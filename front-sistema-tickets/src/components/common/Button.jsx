import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Componente Button reutilizable
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} isLoading - Muestra spinner de carga
 * @param {boolean} disabled - Deshabilita el botón
 * @param {boolean} fullWidth - Ocupa todo el ancho
 * @param {React.ReactNode} icon - Icono a mostrar
 * @param {React.ReactNode} children - Contenido del botón
 * @param {string} className - Clases CSS adicionales
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  children,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] focus:ring-red-500 shadow-md hover:shadow-lg',
    secondary: 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-dark)] focus:ring-blue-500 shadow-md hover:shadow-lg',
    outline: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white focus:ring-red-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed hover:transform-none';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled || isLoading ? disabledClasses : 'hover:-translate-y-0.5 active:translate-y-0'}
    ${widthClasses}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}