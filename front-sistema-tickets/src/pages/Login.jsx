import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plane, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import useAuthStore from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokens, loadUserProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  
  // Usar ref para evitar procesamiento duplicado
  const hasProcessedAuth = useRef(false);

  const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-chzcisisthlmydkb.us.auth0.com';
  const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || 'zaSgoGFBnnNkvlUbNJv9qMrADRJn4wbp';
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000/login';
  const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.miapp.com';

  useEffect(() => {
    // Si ya procesamos la autenticación, no hacer nada
    if (hasProcessedAuth.current) return;

    const hash = location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    if (error) {
      console.error('Auth0 Error:', { error, errorDescription });
      toast.error(errorDescription || 'Error en la autenticación');
      setDebugInfo({ error, errorDescription, type: 'auth0_error' });
      window.location.hash = '';
      return;
    }

    if (accessToken) {
      // Marcar como procesado INMEDIATAMENTE
      hasProcessedAuth.current = true;
      
      console.log('=== Token Received ===');
      console.log('Access Token (first 50 chars):', accessToken.substring(0, 50) + '...');
      console.log('Token length:', accessToken.length);
      
      try {
        const tokenParts = accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token Payload:', payload);
          setDebugInfo({ 
            payload, 
            tokenLength: accessToken.length,
            type: 'token_received' 
          });
        }
      } catch (e) {
        console.error('Error decoding token:', e);
      }

      // Limpiar hash ANTES de procesar
      window.history.replaceState(null, '', window.location.pathname);

      // Procesar autenticación
      handleAuthSuccess(accessToken, idToken);
    }
  }, [location.hash]); // Solo escuchar cambios en el hash

  const handleAuthSuccess = async (accessToken, idToken) => {
    setIsLoading(true);
    
    try {
      console.log('=== Starting Auth Process ===');
      
      // 1. Guardar token PRIMERO
      console.log('Step 1: Saving token to localStorage...');
      localStorage.setItem('accessToken', accessToken);
      
      // 2. Verificar que se guardó
      const savedToken = localStorage.getItem('accessToken');
      if (!savedToken) {
        throw new Error('Failed to save token to localStorage');
      }
      console.log('✓ Token saved successfully');
      
      // 3. Actualizar store
      console.log('Step 2: Updating auth store...');
      setTokens(accessToken, null);
      console.log('✓ Store updated');
      
      // 4. Esperar un momento para asegurar sincronización
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 5. Cargar perfil
      console.log('Step 3: Loading user profile...');
      await loadUserProfile();
      console.log('✓ Profile loaded');
      
      toast.success('¡Bienvenido!');
      
      // 6. Redirigir
      setTimeout(() => {
        navigate('/search', { replace: true });
      }, 500);
      
    } catch (error) {
      console.error('=== Auth Error ===');
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Error al autenticar';
      
      if (error.response?.status === 401) {
        errorMessage = 'Token inválido. Por favor, verifica la configuración de Auth0.';
        
        const debugInfo = {
          tokenExists: !!localStorage.getItem('accessToken'),
          audience: AUTH0_AUDIENCE,
          issuer: `https://${AUTH0_DOMAIN}/`,
          errorData: error.response?.data
        };
        
        console.error('Auth0 Configuration Debug:', debugInfo);
        setDebugInfo(debugInfo);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Limpiar y resetear
      localStorage.removeItem('accessToken');
      hasProcessedAuth.current = false;
      
    } finally {
      setIsLoading(false);
    }
  };

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
    
    console.log('Redirecting to Auth0...');
    window.location.href = authUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando autenticación...</p>
          <p className="text-sm text-gray-500 mt-2">Por favor espera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-4xl font-bold text-primary">
            <Plane className="w-10 h-10" />
            <span>FlightBook</span>
          </div>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

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

            {debugInfo && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800 mb-2">
                      Información de Debug:
                    </p>
                    <pre className="text-xs text-red-700 overflow-auto max-h-40">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

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

        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
          <p className="font-semibold mb-2">Configuración actual:</p>
          <p>Domain: {AUTH0_DOMAIN}</p>
          <p>Client ID: {AUTH0_CLIENT_ID}</p>
          <p>Redirect URI: {REDIRECT_URI}</p>
          <p>Audience: {AUTH0_AUDIENCE}</p>
          <p className="mt-2 text-red-600">
            ⚠️ Verifica estas configuraciones en el Dashboard de Auth0
          </p>
        </div>
      </div>
    </div>
  );
}