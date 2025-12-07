import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function Register() {
  // Configuración de Auth0 - usando variables de entorno de Vite
  const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-chzcisisthlmydkb.us.auth0.com';
  const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || 'zaSgoGFBnnNkvlUbNJv9qMrADRJn4wbp';
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000/login';
  const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.miapp.com';

  const handleAuth0Register = () => {
    // Construir URL de autorización de Auth0 con screen_hint=signup
    const authUrl = `https://${AUTH0_DOMAIN}/authorize?` +
      `response_type=token id_token&` +
      `client_id=${AUTH0_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `audience=${encodeURIComponent(AUTH0_AUDIENCE)}&` +
      `scope=openid profile email&` +
      `screen_hint=signup&` + // Esto muestra el formulario de registro
      `nonce=${Math.random().toString(36).substring(7)}`;
    
    // Redirigir a Auth0
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-4xl font-bold" style={{ color: 'var(--primary)' }}>
            <Plane className="w-10 h-10" />
            <span>FlightBook</span>
          </div>
          <p className="text-gray-600 mt-2">Crea tu cuenta y comienza a volar</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Crea tu cuenta usando Auth0 para una autenticación segura
              </p>
              
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleAuth0Register}
              >
                Crear Cuenta con Auth0
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

            <div className="pt-4 text-center">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Al registrarte, aceptas nuestros{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Términos y Condiciones
            </Link>
            {' '}y{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Política de Privacidad
            </Link>
          </p>
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