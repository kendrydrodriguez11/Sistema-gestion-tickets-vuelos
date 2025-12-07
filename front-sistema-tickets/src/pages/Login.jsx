import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Plane } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuthStore from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokens, loadUserProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Configuración de Auth0 - usando variables de entorno de Vite
  const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-chzcisisthlmydkb.us.auth0.com';
  const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || 'zaSgoGFBnnNkvlUbNJv9qMrADRJn4wbp';
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000/login';
  const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.miapp.com';

  // Procesar token después de redirect de Auth0
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      if (error) {
        toast.error(errorDescription || 'Error en la autenticación');
        console.error('Auth0 Error:', error, errorDescription);
        // Limpiar el hash
        window.location.hash = '';
        return;
      }

      if (accessToken) {
        handleAuthSuccess(accessToken, idToken);
      }
    }
  }, [location]);

  const handleAuthSuccess = async (accessToken, idToken) => {
    setIsLoading(true);
    try {
      console.log('Auth success, saving tokens...');
      console.log('Access Token:', accessToken?.substring(0, 20) + '...');
      
      // Guardar tokens
      setTokens(accessToken, null);
      
      // Verificar que se guardó correctamente
      const savedToken = localStorage.getItem('accessToken');
      console.log('Token saved in localStorage:', !!savedToken);
      
      // Cargar perfil del usuario
      console.log('Loading user profile...');
      await loadUserProfile();
      
      toast.success('¡Bienvenido de nuevo!');
      
      // Limpiar el hash
      window.location.hash = '';
      
      // Redirigir a la página de búsqueda
      setTimeout(() => {
        navigate('/search');
      }, 500);
    } catch (error) {
      console.error('Error loading profile:', error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = 'Error al cargar el perfil';
      
      if (error.response?.status === 401) {
        errorMessage = 'Token inválido. Por favor, intenta de nuevo.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuario no encontrado en el sistema.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      localStorage.removeItem('accessToken');
      
      // Mostrar información de depuración
      console.log('Debug Info:');
      console.log('- Token was saved:', !!localStorage.getItem('accessToken'));
      console.log('- API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
      console.log('- Auth0 Domain:', AUTH0_DOMAIN);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth0Login = () => {
    // Construir URL de autorización de Auth0
    const authUrl = `https://${AUTH0_DOMAIN}/authorize?` +
      `response_type=token id_token&` +
      `client_id=${AUTH0_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `audience=${encodeURIComponent(AUTH0_AUDIENCE)}&` +
      `scope=openid profile email&` +
      `nonce=${Math.random().toString(36).substring(7)}`;
    
    // Redirigir a Auth0
    window.location.href = authUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Iniciando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-4xl font-bold" style={{ color: 'var(--primary)' }}>
            <Plane className="w-10 h-10" />
            <span>FlightBook</span>
          </div>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Usa Auth0 para iniciar sesión de forma segura
              </p>
              
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleAuth0Login}
              >
                Iniciar Sesión con Auth0
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Sistema de autenticación OAuth2
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800 mb-3">
                <strong>Beneficios de Auth0:</strong>
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Autenticación segura y cifrada</li>
                <li>✓ Inicio de sesión con Google, Facebook, etc.</li>
                <li>✓ Recuperación de contraseña fácil</li>
                <li>✓ Protección contra ataques</li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Debugging info (remover en producción) */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
          <p className="font-semibold mb-2">Configuración actual:</p>
          <p>Domain: {AUTH0_DOMAIN}</p>
          <p>Client ID: {AUTH0_CLIENT_ID}</p>
          <p>Redirect URI: {REDIRECT_URI}</p>
          <p className="mt-2 text-red-600">
            ⚠️ Asegúrate de que esta URL esté en "Allowed Callback URLs" en Auth0
          </p>
        </div>
      </div>
    </div>
  );
}