import React from 'react';
import { Loader2, Plane } from 'lucide-react';

/**
 * Componente Spinner - Indicador de carga
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} variant - 'spinner' | 'plane' | 'dots'
 * @param {string} color - Color del spinner (CSS color)
 * @param {string} text - Texto a mostrar debajo del spinner
 * @param {boolean} fullScreen - Ocupa toda la pantalla
 * @param {string} className - Clases CSS adicionales
 */
export default function Spinner({
  size = 'md',
  variant = 'spinner',
  color = 'var(--primary)',
  text = '',
  fullScreen = false,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {variant === 'spinner' && (
        <Loader2 
          className={`${sizeClasses[size]} animate-spin`}
          style={{ color }}
        />
      )}
      
      {variant === 'plane' && (
        <div className="relative">
          <Plane 
            className={`${sizeClasses[size]} animate-bounce`}
            style={{ color }}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-300 rounded-full animate-pulse" />
        </div>
      )}
      
      {variant === 'dots' && (
        <div className="flex gap-2">
          <div 
            className={`w-3 h-3 rounded-full animate-bounce`}
            style={{ 
              backgroundColor: color,
              animationDelay: '0ms'
            }}
          />
          <div 
            className={`w-3 h-3 rounded-full animate-bounce`}
            style={{ 
              backgroundColor: color,
              animationDelay: '150ms'
            }}
          />
          <div 
            className={`w-3 h-3 rounded-full animate-bounce`}
            style={{ 
              backgroundColor: color,
              animationDelay: '300ms'
            }}
          />
        </div>
      )}
      
      {text && (
        <p 
          className={`font-medium ${textSizeClasses[size]}`}
          style={{ color }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

/**
 * Skeleton - Componente de carga tipo skeleton
 */
export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  rounded = 'md'
}) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div 
      className={`bg-gray-200 animate-pulse ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
}

/**
 * Loading Overlay - Overlay de carga sobre contenido
 */
export function LoadingOverlay({ 
  isLoading, 
  children, 
  text = 'Cargando...',
  variant = 'spinner'
}) {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 backdrop-blur-sm rounded-lg z-10">
          <Spinner variant={variant} text={text} size="lg" />
        </div>
      )}
    </div>
  );
}