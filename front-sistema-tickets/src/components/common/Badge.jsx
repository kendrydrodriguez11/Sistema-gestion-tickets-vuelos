import React from 'react';

/**
 * Componente Badge reutilizable
 * @param {React.ReactNode} children - Contenido del badge
 * @param {string} variant - 'success' | 'warning' | 'error' | 'info' | 'default' | 'primary'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {React.ReactNode} icon - Icono opcional
 * @param {string} className - Clases CSS adicionales
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon = null,
  className = '',
}) {
  const variantClasses = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-red-100 text-red-800 border-red-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const combinedClasses = `
    inline-flex items-center gap-1.5
    font-semibold rounded-full border
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <span className={combinedClasses}>
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
}

/**
 * Status Badge - Badge específico para estados
 */
export function StatusBadge({ status }) {
  const statusConfig = {
    PENDING: { variant: 'warning', label: 'Pendiente' },
    PROCESSING: { variant: 'info', label: 'Procesando' },
    CONFIRMED: { variant: 'success', label: 'Confirmado' },
    COMPLETED: { variant: 'success', label: 'Completado' },
    CANCELLED: { variant: 'error', label: 'Cancelado' },
    FAILED: { variant: 'error', label: 'Fallido' },
    EXPIRED: { variant: 'error', label: 'Expirado' },
    REFUNDED: { variant: 'info', label: 'Reembolsado' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}

/**
 * Price Level Badge - Badge para nivel de precio
 */
export function PriceLevelBadge({ level }) {
  const levelConfig = {
    LOW: { variant: 'success', label: 'Precio Bajo', icon: '↓' },
    MEDIUM: { variant: 'warning', label: 'Precio Medio', icon: '→' },
    HIGH: { variant: 'error', label: 'Precio Alto', icon: '↑' },
  };

  const config = levelConfig[level] || { variant: 'default', label: level };

  return (
    <Badge variant={config.variant}>
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  );
}