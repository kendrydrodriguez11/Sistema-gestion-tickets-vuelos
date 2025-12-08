import { Link, useNavigate } from 'react-router-dom';
import { Plane, User, LogOut, Menu, X, Ticket, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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

            {isAuthenticated ? (
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
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    {user?.firstName || 'Mi Cuenta'}
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
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Registrarse
                </Link>
              </>
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
              
              {isAuthenticated ? (
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
                <>
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-gray-700 hover:bg-white rounded-lg font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-4 py-2 bg-primary text-white rounded-lg font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}