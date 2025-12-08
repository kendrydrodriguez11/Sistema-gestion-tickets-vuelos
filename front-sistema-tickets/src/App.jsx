import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import FlightSearch from './pages/FlightSearch';
import FlightDetails from './pages/FlightDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import PaymentSuccess from './pages/PaymentSuccess';
import useAuthStore from './store/authStore';
import toast from 'react-hot-toast';
import Spinner from './components/common/Spinner';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner variant="plane" size="lg" text="Cargando..." /></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  const { isAuthenticated, loadUserProfile, setTokens, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Procesar callback de Auth0
    const procesAuth0Callback = async () => {
      const hash = window.location.hash;
      
      if (hash) {
        try {
          console.log('🔐 Auth0 callback detectado');
          
          // Extraer tokens del hash (access_token, id_token)
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const idToken = hashParams.get('id_token');
          const state = hashParams.get('state');

          if (!accessToken) {
            console.error('❌ No access token in callback');
            window.location.hash = '';
            return;
          }

          console.log('✅ Tokens obtenidos de Auth0');

          // Guardar tokens
          setTokens(accessToken, idToken);

          // Limpiar hash
          window.location.hash = '';

          // 🔥 IMPORTANTE: Cargar perfil del usuario desde tu backend
          // Esto valida el token con Auth0 y crea/actualiza el usuario en tu BD
          console.log('📡 Llamando a backend para validar usuario...');
          await loadUserProfile();

          console.log('✅ Usuario cargado correctamente del backend');

          // Redirigir a home
          navigate('/');
          toast.success('¡Sesión iniciada correctamente!');
        } catch (error) {
          console.error('❌ Error procesando callback:', error);
          window.location.hash = '';
          toast.error('Error al iniciar sesión: ' + (error.message || 'Error desconocido'));
          
          // Limpiar tokens si hay error
          localStorage.removeItem('accessToken');
          localStorage.removeItem('idToken');
        }
      }
    };

    procesAuth0Callback();
  }, []);

  if (isLoading && !isAuthenticated && window.location.hash) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="plane" size="xl" text="Iniciando sesión..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<FlightSearch />} />
          <Route path="/flight/:id" element={<FlightDetails />} />

          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/payment/success" element={<PaymentSuccess />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;