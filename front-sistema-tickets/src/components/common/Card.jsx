import React from 'react';

/**
 * Componente Card reutilizable
 * @param {React.ReactNode} children - Contenido de la tarjeta
 * @param {string} className - Clases CSS adicionales
 * @param {boolean} hover - Activa efecto hover
 * @param {boolean} clickable - Hace la tarjeta clickeable
 * @param {function} onClick - Función al hacer click
 * @param {string} padding - 'none' | 'sm' | 'md' | 'lg'
 */
export default function Card({
  children,
  className = '',
  hover = false,
  clickable = false,
  onClick,
  padding = 'md',
  ...props
}) {
  const baseClasses = 'bg-white rounded-xl shadow-md transition-all duration-300';
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverClasses = hover || clickable ? 'hover:shadow-xl hover:-translate-y-1' : '';
  const clickableClasses = clickable ? 'cursor-pointer' : '';
  
  const combinedClasses = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `.trim();

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Card Header - Sección superior de la tarjeta
 */
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Title - Título de la tarjeta
 */
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

/**
 * Card Description - Descripción de la tarjeta
 */
export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`}>
      {children}
    </p>
  );
}

/**
 * Card Content - Contenido principal de la tarjeta
 */
export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * Card Footer - Pie de la tarjeta
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}