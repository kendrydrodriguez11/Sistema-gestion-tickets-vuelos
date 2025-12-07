import { useState } from 'react';
import { Plane, MapPin, Users, Calendar, Clock, Award, Wifi, Coffee, Tv, Luggage, Shield, CreditCard, ChevronRight } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency, formatTime, formatDate, formatFlightDuration } from '../../utils/formatters';

export default function FlightDetails({ flight, onSelect }) {
  const [selectedClass, setSelectedClass] = useState('ECONOMY');

  if (!flight) return null;

  const amenities = [
    { icon: Wifi, label: 'WiFi a bordo', available: true },
    { icon: Coffee, label: 'Servicio de comida', available: true },
    { icon: Tv, label: 'Entretenimiento', available: true },
    { icon: Luggage, label: 'Equipaje incluido', available: true },
  ];

  const seatClasses = [
    {
      type: 'ECONOMY',
      name: 'Económica',
      seats: flight.aircraft?.economySeats || 0,
      price: flight.currentPrice || flight.basePrice,
      features: [
        'Equipaje de mano: 8kg',
        'Equipaje facturado: 23kg',
        'Selección de asiento',
        'Snack y bebida incluidos'
      ]
    },
    {
      type: 'BUSINESS',
      name: 'Ejecutiva',
      seats: flight.aircraft?.businessSeats || 0,
      price: (flight.currentPrice || flight.basePrice) * 2.5,
      features: [
        'Equipaje de mano: 12kg',
        'Equipaje facturado: 32kg',
        'Asiento prioritario',
        'Comida premium',
        'Acceso a Sala VIP',
        'Embarque prioritario'
      ]
    },
    {
      type: 'FIRST_CLASS',
      name: 'Primera Clase',
      seats: flight.aircraft?.firstClassSeats || 0,
      price: (flight.currentPrice || flight.basePrice) * 4,
      features: [
        'Equipaje de mano: 16kg',
        'Equipaje facturado: 40kg',
        'Asiento cama reclinable',
        'Menú gourmet',
        'Acceso Premium a Sala VIP',
        'Embarque prioritario',
        'Servicio personalizado'
      ]
    }
  ];

  const selectedClassData = seatClasses.find(c => c.type === selectedClass);

  return (
    <div className="space-y-6">
      {/* Header con información principal del vuelo */}
      <Card className="bg-gradient-to-r from-blue-600 to-red-600 text-white">
        <CardContent className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{flight.flightNumber}</h2>
                <p className="text-blue-100">Vuelo directo</p>
              </div>
            </div>
            <Badge variant="success" className="text-lg px-4 py-2">
              {flight.availableSeats} asientos disponibles
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Origen */}
            <div>
              <div className="text-5xl font-bold mb-2">
                {formatTime(flight.departureTime)}
              </div>
              <div className="text-2xl font-semibold mb-1">
                {flight.route?.originAirport}
              </div>
              <div className="text-blue-100 text-lg">
                {flight.route?.originCity}
              </div>
              <div className="text-sm text-blue-200 mt-2">
                {formatDate(flight.departureTime)}
              </div>
            </div>

            {/* Duración */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 h-1 bg-white/30"></div>
                <div className="mx-4">
                  <Clock className="w-8 h-8 text-yellow-300" />
                </div>
                <div className="flex-1 h-1 bg-white/30"></div>
              </div>
              <div className="text-xl font-semibold">
                {formatFlightDuration(flight.route?.estimatedDurationMinutes || 60)}
              </div>
              <div className="text-blue-100 text-sm mt-1">Vuelo directo</div>
              <div className="mt-3 text-sm">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  {flight.route?.distanceKm} km
                </span>
              </div>
            </div>

            {/* Destino */}
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">
                {formatTime(flight.arrivalTime)}
              </div>
              <div className="text-2xl font-semibold mb-1">
                {flight.route?.destinationAirport}
              </div>
              <div className="text-blue-100 text-lg">
                {flight.route?.destinationCity}
              </div>
              <div className="text-sm text-blue-200 mt-2">
                {formatDate(flight.arrivalTime)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selección de clase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Elige tu Clase de Viaje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {seatClasses.map((classType) => (
              <button
                key={classType.type}
                onClick={() => setSelectedClass(classType.type)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                  hover:shadow-lg hover:-translate-y-1
                  ${selectedClass === classType.type 
                    ? 'border-primary bg-red-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {selectedClass === classType.type && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {classType.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {classType.seats} asientos disponibles
                  </p>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {formatCurrency(classType.price)}
                  </div>
                  <div className="text-sm text-gray-600">por persona</div>
                </div>

                <ul className="space-y-2">
                  {classType.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {classType.features.length > 4 && (
                  <div className="mt-3 text-sm text-primary font-semibold">
                    +{classType.features.length - 4} beneficios más
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalles de la aeronave */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Aeronave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Modelo</div>
                <div className="font-semibold text-lg">{flight.aircraft?.model}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Capacidad Total</div>
                <div className="font-semibold text-lg">{flight.aircraft?.totalSeats} pasajeros</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Fabricante</div>
                <div className="font-semibold text-lg">{flight.aircraft?.manufacturer}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenidades */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios a Bordo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <div
                  key={index}
                  className={`
                    flex flex-col items-center gap-3 p-4 rounded-lg border-2
                    ${amenity.available 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${amenity.available ? 'bg-green-100' : 'bg-gray-200'}
                  `}>
                    <Icon className={`w-6 h-6 ${amenity.available ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <span className="text-sm font-medium text-center text-gray-700">
                    {amenity.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Información de equipaje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Luggage className="w-5 h-5 text-primary" />
            Política de Equipaje - {selectedClassData?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
              <h4 className="font-bold text-lg mb-4 text-blue-900">Equipaje de Mano</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Peso máximo</span>
                  <span className="font-semibold text-blue-900">
                    {selectedClass === 'FIRST_CLASS' ? '16kg' : selectedClass === 'BUSINESS' ? '12kg' : '8kg'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Dimensiones</span>
                  <span className="font-semibold text-blue-900">55x35x25 cm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Piezas</span>
                  <span className="font-semibold text-blue-900">1 maleta + 1 artículo personal</span>
                </div>
              </div>
            </div>

            <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
              <h4 className="font-bold text-lg mb-4 text-purple-900">Equipaje Facturado</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Peso máximo</span>
                  <span className="font-semibold text-purple-900">
                    {selectedClass === 'FIRST_CLASS' ? '40kg' : selectedClass === 'BUSINESS' ? '32kg' : '23kg'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Dimensiones</span>
                  <span className="font-semibold text-purple-900">158 cm lineales</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Piezas incluidas</span>
                  <span className="font-semibold text-purple-900">
                    {selectedClass === 'FIRST_CLASS' ? '3' : selectedClass === 'BUSINESS' ? '2' : '1'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Equipaje adicional tiene costo extra. 
              Consulta las políticas completas de equipaje antes de tu vuelo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resumen y botón de selección */}
      <Card className="border-2 border-primary">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-gray-600 mb-1">Precio total seleccionado</div>
              <div className="flex items-baseline gap-2 justify-center md:justify-start">
                <span className="text-gray-400 line-through text-xl">
                  {formatCurrency(flight.basePrice)}
                </span>
                <span className="text-5xl font-bold text-primary">
                  {formatCurrency(selectedClassData?.price || flight.currentPrice)}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                por persona en clase {selectedClassData?.name}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => onSelect && onSelect({ ...flight, selectedClass, price: selectedClassData?.price })}
                className="text-lg px-8 py-4"
                icon={<CreditCard className="w-5 h-5" />}
              >
                Seleccionar y Continuar
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Pago 100% seguro</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Términos y condiciones */}
      <Card className="bg-gray-50">
        <CardContent>
          <h4 className="font-semibold mb-3">Términos y Condiciones</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Los precios están sujetos a disponibilidad y pueden cambiar sin previo aviso</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Cambios y cancelaciones sujetos a penalidades según la tarifa seleccionada</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Los pasajeros deben presentarse en el aeropuerto con 2 horas de anticipación</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>Es obligatorio presentar documento de identidad válido al momento del check-in</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}