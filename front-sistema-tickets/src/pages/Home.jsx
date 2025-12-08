import { Link } from 'react-router-dom';
import { Search, Shield, Clock, Award, Globe, Users, TrendingUp } from 'lucide-react';
import Card from '../components/common/Card';
import useAuthStore from '../store/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  const popularDestinations = [
    { city: 'Quito', code: 'UIO', image: 'https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?w=800', price: '49' },
    { city: 'Guayaquil', code: 'GYE', image: 'https://images.unsplash.com/photo-1501952476817-d7ae22e8ee4e?w=800', price: '65' },
    { city: 'Cuenca', code: 'CUE', image: 'https://images.unsplash.com/photo-1555881805-ec05670d1f08?w=800', price: '79' },
    { city: 'Galápagos', code: 'GPS', image: 'https://images.unsplash.com/photo-1561366174-8e9e64b91f10?w=800', price: '199' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[700px] flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(0, 47, 135, 0.85), rgba(226, 0, 26, 0.85)), url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Decoración de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container text-center z-10 relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 fade-in leading-tight">
              Tu próxima
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
                aventura comienza aquí
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 fade-in text-gray-100 max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Descubre los mejores destinos con precios increíbles. 
              Reserva tu vuelo en minutos con la mejor experiencia digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '0.4s' }}>
              <Link 
                to="/search" 
                className="btn btn-primary inline-flex items-center gap-3 text-lg px-10 py-5 shadow-2xl hover:shadow-white/20 transform hover:scale-105 transition-all"
              >
                <Search className="w-6 h-6" />
                Buscar Vuelos
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/my-bookings" 
                  className="btn btn-outline inline-flex items-center gap-3 text-lg px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20"
                >
                  Ver Mis Reservas
                </Link>
              )}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-sm text-gray-200">Destinos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-sm text-gray-200">Clientes Felices</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">4.9★</div>
                <div className="text-sm text-gray-200">Calificación</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Destinos Populares */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Destinos Populares
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora los lugares más visitados y reserva tu próximo viaje
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, index) => (
              <Link 
                key={dest.code}
                to={`/search?destination=${dest.code}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-80">
                  <img 
                    src={dest.image} 
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="text-3xl font-bold mb-2">{dest.city}</div>
                    <div className="text-sm text-gray-200 mb-3">{dest.code}</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-300">Desde</div>
                        <div className="text-2xl font-bold">${dest.price}</div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Search className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            ¿Por qué reservar con nosotros?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            La mejor experiencia de reserva con tecnología de punta y servicio excepcional
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Shield,
                title: 'Seguro y Confiable',
                description: 'Tus datos están protegidos con los más altos estándares de seguridad. Encriptación SSL y cumplimiento PCI DSS.',
                color: 'text-green-600',
                bgColor: 'bg-green-50'
              },
              {
                icon: Clock,
                title: 'Reserva en Minutos',
                description: 'Proceso de reserva simple y rápido en solo 3 pasos. Sin complicaciones, sin esperas innecesarias.',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50'
              },
              {
                icon: Award,
                title: 'Mejores Precios',
                description: 'Precios dinámicos y competitivos con ofertas especiales todo el año. Garantía del mejor precio del mercado.',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50'
              },
              {
                icon: Globe,
                title: 'Cobertura Nacional',
                description: 'Vuelos a todos los principales destinos del Ecuador. Conectamos el país de costa a costa.',
                color: 'text-purple-600',
                bgColor: 'bg-purple-50'
              },
              {
                icon: Users,
                title: 'Soporte 24/7',
                description: 'Nuestro equipo está disponible las 24 horas para ayudarte con cualquier consulta o problema.',
                color: 'text-red-600',
                bgColor: 'bg-red-50'
              },
              {
                icon: TrendingUp,
                title: 'Mejor Calificación',
                description: 'Miles de clientes satisfechos nos respaldan. Calificación promedio de 4.9/5 estrellas.',
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  hover 
                  className="text-center p-8 border border-gray-100"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div 
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${feature.bgColor} flex items-center justify-center transform hover:rotate-6 transition-transform`}
                  >
                    <Icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #002F87 0%, #E2001A 100%)',
          }}
        ></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Encuentra los mejores vuelos al mejor precio y comienza a crear 
            recuerdos inolvidables
          </p>
          <Link 
            to="/search" 
            className="btn inline-flex items-center gap-3 text-lg px-10 py-5 bg-white text-primary hover:bg-gray-100 shadow-2xl transform hover:scale-105 transition-all"
          >
            <Search className="w-6 h-6" />
            Comenzar Búsqueda
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Suscríbete a Nuestro Newsletter
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Recibe las mejores ofertas y promociones directamente en tu email
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}