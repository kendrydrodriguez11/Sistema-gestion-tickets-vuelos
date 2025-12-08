import { useState, useEffect, useRef } from 'react';
import { Plane, Mail, Shield, Clock } from 'lucide-react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const hasProcessedAuth = useRef(false);

  const AUTH0_DOMAIN = 'dev-chzcisisthlmydkb.us.auth0.com';
  const AUTH0_CLIENT_ID = 'zaSgoGFBnnNkvlUbNJv9qMrADRJn4wbp';
  const REDIRECT_URI = 'http://localhost:3000/login';
  const AUTH0_AUDIENCE = 'https://api.miapp.com';

  const handleAuth0Login = () => {
    const state = Math.random().toString(36).substring(7);
    const nonce = Math.random().toString(36).substring(7);
    sessionStorage.setItem('auth0_state', state);
    const authUrl = `https://${AUTH0_DOMAIN}/authorize?response_type=token id_token&client_id=${AUTH0_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&audience=${encodeURIComponent(AUTH0_AUDIENCE)}&scope=openid profile email&state=${state}&nonce=${nonce}`;
    window.location.href = authUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Autenticando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Elementos decorativos animados */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl" style={{ animation: 'float 3s ease-in-out infinite' }}></div>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Grid de 2 columnas */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* COLUMNA IZQUIERDA - Imagen y descripción */}
          <div className="hidden md:flex flex-col justify-center text-white space-y-8">
            {/* Logo y marca */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-blue-400/20 flex items-center justify-center backdrop-blur-md border border-blue-400/30">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">FlightBook</h1>
                <p className="text-blue-200 text-sm font-medium">Viaja con confianza</p>
              </div>
            </div>

            {/* Imagen ilustrativa SVG */}
            <div className="relative w-full h-56 flex items-center justify-center">
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full opacity-60 hover:opacity-80 transition-opacity"
                fill="none"
                stroke="white"
              >
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#skyGrad)" />
                <path d="M 0 150 Q 200 140 400 150" strokeWidth="1" opacity="0.2" />

                {/* Avión principal */}
                <g transform="translate(200, 120)">
                  <ellipse cx="0" cy="0" rx="35" ry="12" fill="white" opacity="0.15" />
                  <path d="M -25 -3 L 25 -3 L 40 -8 L 25 -1 L 40 0 L 25 0 L -25 3 Z" fill="white" opacity="0.2" strokeWidth="0" />
                  <circle cx="-10" cy="0" r="2" fill="white" opacity="0.3" />
                  <circle cx="0" cy="0" r="2" fill="white" opacity="0.3" />
                  <circle cx="10" cy="0" r="2" fill="white" opacity="0.3" />
                </g>

                {/* Ciudades */}
                <g opacity="0.3">
                  <circle cx="80" cy="220" r="6" fill="white" />
                  <circle cx="80" cy="220" r="10" fill="none" strokeWidth="1" />
                  <text x="80" y="245" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">Origen</text>

                  <circle cx="320" cy="220" r="6" fill="white" />
                  <circle cx="320" cy="220" r="10" fill="none" strokeWidth="1" />
                  <text x="320" y="245" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">Destino</text>

                  <path d="M 90 218 Q 200 100 310 218" strokeWidth="1" strokeDasharray="4" opacity="0.2" />
                </g>
              </svg>
            </div>

            {/* Descripción */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold leading-tight">
                Descubre tu próximo destino
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Accede a miles de vuelos con los mejores precios del mercado. Compara, reserva y vuela hacia tus sueños.
              </p>
              <p className="text-blue-300 text-xs font-medium pt-2">
                ✈️ Más de 50 destinos disponibles
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA - Formulario de Login */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            {/* Encabezado */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Bienvenido</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Inicia sesión para acceder a tu cuenta y gestiona todas tus reservas
              </p>
            </div>

            {/* Botón principal */}
            <button
              onClick={handleAuth0Login}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" opacity="0.1" />
                <circle cx="12" cy="8" r="3" />
                <path d="M6 14c0-2.21 2.69-4 6-4s6 1.79 6 4" />
              </svg>
              <span>Continuar con Auth0</span>
            </button>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600 font-medium">
                  Ventajas de viajar con nosotros
                </span>
              </div>
            </div>

            {/* Grid de beneficios - CORREGIDO */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                <div className="w-8 h-8 rounded-lg bg-blue-200 flex items-center justify-center mb-2">
                  <Shield className="w-4 h-4 text-blue-700" />
                </div>
                <p className="text-xs font-bold text-gray-900">100% Seguro</p>
                <p className="text-xs text-gray-700 mt-1">Certificado SSL</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                <div className="w-8 h-8 rounded-lg bg-green-200 flex items-center justify-center mb-2">
                  <Plane className="w-4 h-4 text-green-700" />
                </div>
                <p className="text-xs font-bold text-gray-900">Miles Vuelos</p>
                <p className="text-xs text-gray-700 mt-1">50+ destinos</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                <div className="w-8 h-8 rounded-lg bg-purple-200 flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-purple-700" />
                </div>
                <p className="text-xs font-bold text-gray-900">Rápido</p>
                <p className="text-xs text-gray-700 mt-1">3 pasos</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                <div className="w-8 h-8 rounded-lg bg-orange-200 flex items-center justify-center mb-2">
                  <Mail className="w-4 h-4 text-orange-700" />
                </div>
                <p className="text-xs font-bold text-gray-900">Soporte 24/7</p>
                <p className="text-xs text-gray-700 mt-1">Siempre disponible</p>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-700">
                ¿No tienes cuenta?{' '}
                <a href="#" className="text-blue-600 font-semibold hover:underline">
                  Regístrate aquí
                </a>
              </p>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                <a href="#" className="hover:text-gray-900 transition-colors">Términos</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-900 transition-colors">Privacidad</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-900 transition-colors">Soporte</a>
              </div>
            </div>
          </div>
        </div>

        {/* Información móvil */}
        <div className="md:hidden text-white text-center mt-12 space-y-3">
          <h2 className="text-2xl font-bold">Descubre tu próximo destino</h2>
          <p className="text-sm text-blue-200">
            Accede a miles de vuelos con los mejores precios
          </p>
        </div>
      </div>

      {/* Estilos */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}