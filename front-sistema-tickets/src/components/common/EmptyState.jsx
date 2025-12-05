import React from 'react';
import { Search, Inbox, AlertCircle, FileX } from 'lucide-react';
import Button from './Button';

/**
 * Componente EmptyState - Muestra cuando no hay datos
 * @param {string} icon - 'search' | 'inbox' | 'error' | 'file' | custom icon
 * @param {string} title - Título del estado vacío
 * @param {string} description - Descripción
 * @param {React.ReactNode} action - Botón o acción
 * @param {string} className - Clases CSS adicionales
 */
export default function EmptyState({
  icon = 'inbox',
  title = 'No hay datos',
  description,
  action,
  className = '',
}) {
  const iconMap = {
    search: Search,
    inbox: Inbox,
    error: AlertCircle,
    file: FileX,
  };

  const IconComponent = typeof icon === 'string' ? iconMap[icon] : null;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div 
        className="w-20 h-20 mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--gray-100)' }}
      >
        {IconComponent ? (
          <IconComponent className="w-10 h-10 text-gray-400" />
        ) : (
          icon
        )}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * No Results - Para resultados de búsqueda vacíos
 */
export function NoResults({ 
  searchTerm, 
  onReset,
  resetLabel = 'Limpiar búsqueda'
}) {
  return (
    <EmptyState
      icon="search"
      title="No se encontraron resultados"
      description={
        searchTerm 
          ? `No se encontraron resultados para "${searchTerm}"`
          : 'Intenta con otros criterios de búsqueda'
      }
      action={
        onReset && (
          <Button variant="outline" onClick={onReset}>
            {resetLabel}
          </Button>
        )
      }
    />
  );
}

/**
 * Error State - Para mostrar errores
 */
export function ErrorState({ 
  title = 'Ha ocurrido un error',
  message = 'No pudimos cargar la información. Por favor, intenta nuevamente.',
  onRetry,
  retryLabel = 'Reintentar'
}) {
  return (
    <EmptyState
      icon="error"
      title={title}
      description={message}
      action={
        onRetry && (
          <Button variant="primary" onClick={onRetry}>
            {retryLabel}
          </Button>
        )
      }
    />
  );
}