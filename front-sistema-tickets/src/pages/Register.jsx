import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function Register() {
  const handleAuth0Register = () => {
    // Redirigir a Auth0 con screen_hint=signup para mostrar el formulario de registro
    const auth0Domain = 'dev-chzcisisthlmydkb.us.auth0.com';
    const clientId = 'zaSgoGFBnnNkvlUbNJv9qMrADRJn4wbp';
    const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
    const audience = encodeURIComponent('https://api.miapp.com');
    
    const auth0Url = `https://${auth0Domain}/authorize?` +
      `response_type=token&` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `audience=${audience}&` +
      `scope=openid profile email&` +
      `screen_hint=signup`; // Muestra el formulario de registro
    
    window.location.href = auth0Url;
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
      </div>
    </div>
  );
}