import { useState } from 'react';
import { Plane, Calendar, Users, Search } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { AIRPORTS } from '../../utils/constants';
import { validateAirportCode, validateOriginDestination, validateFlightDate, validatePassengers } from '../../utils/validators';
import toast from 'react-hot-toast';
import useFlightStore from '../../store/flightStore';

export default function FlightSearchForm({ onSearch }) {
  const { setSearchParams } = useFlightStore();
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    newErrors.origin = validateAirportCode(formData.origin, 'origen');
    newErrors.destination = validateAirportCode(formData.destination, 'destino');
    
    const odError = validateOriginDestination(formData.origin, formData.destination);
    if (odError) {
      newErrors.origin = odError;
      newErrors.destination = odError;
    }

    newErrors.departureDate = validateFlightDate(formData.departureDate);
    newErrors.passengers = validatePassengers(formData.passengers);

    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Por favor, completa todos los campos correctamente');
      return;
    }

    setSearchParams(formData);
    onSearch(formData);
  };

  const airportOptions = AIRPORTS.map(airport => ({
    value: airport.code,
    label: `${airport.code} - ${airport.city}`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Select
          label="Origen"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          options={airportOptions}
          placeholder="Selecciona el aeropuerto de origen"
          error={errors.origin}
          required
        />

        <Select
          label="Destino"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          options={airportOptions}
          placeholder="Selecciona el aeropuerto de destino"
          error={errors.destination}
          required
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Input
          label="Fecha de Ida"
          type="date"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
          error={errors.departureDate}
          icon={<Calendar className="w-5 h-5" />}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <Input
          label="Fecha de Regreso (Opcional)"
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          icon={<Calendar className="w-5 h-5" />}
          min={formData.departureDate || new Date().toISOString().split('T')[0]}
        />

        <Input
          label="Pasajeros"
          type="number"
          name="passengers"
          value={formData.passengers}
          onChange={handleChange}
          error={errors.passengers}
          icon={<Users className="w-5 h-5" />}
          min="1"
          max="9"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        icon={<Search className="w-5 h-5" />}
      >
        Buscar Vuelos
      </Button>
    </form>
  );
}