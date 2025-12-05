import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Componente Alert reutilizable
 * @param {string} variant - 'success' | 'error' | 'warning' | 'info'
 * @param {string} title - Título de la alerta
 * @param {React.ReactNode} children - Contenido de la alerta
 * @param {boolean} dismissible - Permite cerrar la alerta
 * @param {function} onDismiss - Función al cerrar
 * @param {string} className - Clases CSS adicionales
 */
export default function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
}) {
  const variantConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500',
      Icon: CheckCircle,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
      Icon: AlertCircle,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      Icon: AlertTriangle,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
      Icon: Info,
    },
  };

  const config = variantConfig[variant];
  const Icon = config.Icon;

  return (
    <div 
      className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border-l-4 rounded-lg p-4
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
        
        <div className="flex-1">
          {title && (
            <h3 className="font-semibold mb-1">
              {title}
            </h3>
          )}
          
          {children && (
            <div className="text-sm">
              {children}
            </div>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={onDismiss}
            className={`
              p-1 rounded-lg transition-colors flex-shrink-0
              hover:bg-black hover:bg-opacity-10
              ${config.textColor}
            `}
            aria-label="Cerrar alerta"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Alert List - Lista de alertas
 */
export function AlertList({ alerts = [], onDismiss }) {
  if (!alerts.length) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <Alert
          key={alert.id || index}
          variant={alert.variant}
          title={alert.title}
          dismissible={alert.dismissible}
          onDismiss={() => onDismiss && onDismiss(alert.id || index)}
        >
          {alert.message}
        </Alert>
      ))}
    </div>
  );
}