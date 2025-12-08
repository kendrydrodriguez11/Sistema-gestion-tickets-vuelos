import { Link, useNavigate } from 'react-router-dom';
import { Plane, User, LogOut, Menu, X, Ticket, ChevronDown, LogIn } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Configuración Auth0
  const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-chzcisisthlmydkb.us.auth0.com';
  const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || 'zaSgoGFBnnNkvlUbNJv9qMrADRJn4wbp';
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000';
  const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.miapp.com';

  const handleAuth0Login = () => {
    const state = Math.random().toString(36).substring(7);
    const nonce = Math.random().toString(36).substring(7);
    sessionStorage.setItem('auth0_state', state);
    
    const authUrl = `https://${AUTH0_DOMAIN}/authorize?` +
      `response_type=token id_token&` +
      `client_id=${AUTH0_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `audience=${encodeURIComponent(AUTH0_AUDIENCE)}&` +
      `scope=openid profile email&` +
      `state=${state}&` +
      `nonce=${nonce}`;
    
    console.log('🔐 Redirigiendo a Auth0:', authUrl);
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    logout();
    const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = logoutUrl;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 font-bold transition-opacity hover:opacity-80"
          >
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-gray-900">FlightBook</div>
              <div className="text-xs text-gray-500">Premium Travel</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              to="/search" 
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Buscar Vuelos
            </Link>

            {isAuthenticated && user ? (
              <>
                <Link 
                  to="/my-bookings" 
                  className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  <Ticket className="w-4 h-4" />
                  Mis Reservas
                </Link>
                
                <div className="relative group">
                  <button 
                    className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium transition-colors py-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    {user?.firstName || user?.email?.split('@')[0] || 'Cuenta'}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  <div className="absolute right-0 mt-0 w-56 bg-white rounded-lg shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button 
                onClick={() => {
                  handleAuth0Login();
                }}
                className="btn btn-primary inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.94 0 7.5 1.37 10.29 4.07l7.68-7.68C37.15 1.69 30.94 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.93 6.92C13.51 13.52 18.34 9.5 24 9.5z"/>
                  <path fill="#FBBC05" d="M46.13 24.55c0-1.57-.15-3.09-.43-4.55H24v9.11h12.46c-.54 2.92-2.17 5.39-4.63 7.06l8.06 6.26C43.83 38.14 46.13 31.74 46.13 24.55z"/>
                  <path fill="#34A853" d="M11.49 28.14c-.48-1.43-.75-2.96-.75-4.54 0-1.58.27-3.11.75-4.54l-8.93-6.92C.89 15.55 0 19.68 0 24c0 4.32.89 8.45 2.56 12.86l8.93-6.92z"/>
                  <path fill="#4285F4" d="M24 48c6.94 0 13.15-2.31 18.02-6.27l-8.06-6.26C31.18 37.3 27.74 38.5 24 38.5c-5.66 0-10.49-4.02-12.51-9.64l-8.93 6.92C6.51 42.62 14.62 48 24 48z"/>
                </svg>

                Iniciar con Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-gray-50 animate-slideUp">
            <div className="px-4 py-4 space-y-4">
              <Link 
                to="/search" 
                className="block px-4 py-2 text-gray-700 hover:bg-white rounded-lg font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Buscar Vuelos
              </Link>
              
              {isAuthenticated && user ? (
                <>
                  <Link 
                    to="/my-bookings" 
                    className="block px-4 py-2 text-gray-700 hover:bg-white rounded-lg font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mis Reservas
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-700 hover:bg-white rounded-lg font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-white rounded-lg font-medium transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    handleAuth0Login();
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-primary inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.94 0 7.5 1.37 10.29 4.07l7.68-7.68C37.15 1.69 30.94 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.93 6.92C13.51 13.52 18.34 9.5 24 9.5z"/>
                    <path fill="#FBBC05" d="M46.13 24.55c0-1.57-.15-3.09-.43-4.55H24v9.11h12.46c-.54 2.92-2.17 5.39-4.63 7.06l8.06 6.26C43.83 38.14 46.13 31.74 46.13 24.55z"/>
                    <path fill="#34A853" d="M11.49 28.14c-.48-1.43-.75-2.96-.75-4.54 0-1.58.27-3.11.75-4.54l-8.93-6.92C.89 15.55 0 19.68 0 24c0 4.32.89 8.45 2.56 12.86l8.93-6.92z"/>
                    <path fill="#4285F4" d="M24 48c6.94 0 13.15-2.31 18.02-6.27l-8.06-6.26C31.18 37.3 27.74 38.5 24 38.5c-5.66 0-10.49-4.02-12.51-9.64l-8.93 6.92C6.51 42.62 14.62 48 24 48z"/>
                  </svg>

                  Iniciar con Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}