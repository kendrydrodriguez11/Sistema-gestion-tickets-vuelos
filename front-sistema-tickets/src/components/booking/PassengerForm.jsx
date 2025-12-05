import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Card from '../common/Card';
import { DOCUMENT_TYPES } from '../../utils/constants';
import { validateName, validateDocument, validateDateOfBirth } from '../../utils/validators';
import useBookingStore from '../../store/bookingStore';
import toast from 'react-hot-toast';

export default function PassengerForm() {
  const { selectedSeats, passengers, addPassenger, updatePassenger, removePassenger } = useBookingStore();
  
  const [currentPassenger, setCurrentPassenger] = useState({
    firstName: '',
    lastName: '',
    documentType: 'CEDULA',
    documentNumber: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPassenger(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    newErrors.firstName = validateName(currentPassenger.firstName, 'nombre');
    newErrors.lastName = validateName(currentPassenger.lastName, 'apellido');
    newErrors.documentNumber = validateDocument(
      currentPassenger.documentNumber,
      currentPassenger.documentType
    );
    newErrors.dateOfBirth = validateDateOfBirth(currentPassenger.dateOfBirth);

    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPassenger = () => {
    if (!validate()) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    if (passengers.length >= selectedSeats.length) {
      toast.error('Ya agregaste todos los pasajeros necesarios');
      return;
    }

    addPassenger(currentPassenger);
    setCurrentPassenger({
      firstName: '',
      lastName: '',
      documentType: 'CEDULA',
      documentNumber: '',
      dateOfBirth: ''
    });
    toast.success('Pasajero agregado');
  };

  const handleRemovePassenger = (index) => {
    removePassenger(index);
    toast.success('Pasajero removido');
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-800">
          <strong>Asientos seleccionados: {selectedSeats.length}</strong>
          <br />
          Debes agregar información de {selectedSeats.length} pasajero(s).
          Actualmente tienes {passengers.length} registrado(s).
        </p>
      </div>

      {/* Pasajeros ya agregados */}
      {passengers.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-lg">Pasajeros Registrados</h3>
          {passengers.map((passenger, index) => (
            <Card key={index} className="bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-lg">
                    {passenger.firstName} {passenger.lastName}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {passenger.documentType}: {passenger.documentNumber}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Asiento: {selectedSeats[index]?.seatNumber}
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleRemovePassenger(index)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Formulario para nuevo pasajero */}
      {passengers.length < selectedSeats.length && (
        <Card className="bg-white">
          <h3 className="font-bold text-lg mb-4">
            Pasajero #{passengers.length + 1} - Asiento {selectedSeats[passengers.length]?.seatNumber}
          </h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Nombre(s)"
                name="firstName"
                value={currentPassenger.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="Juan Carlos"
                required
              />

              <Input
                label="Apellido(s)"
                name="lastName"
                value={currentPassenger.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Pérez García"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Tipo de Documento"
                name="documentType"
                value={currentPassenger.documentType}
                onChange={handleChange}
                options={DOCUMENT_TYPES}
                required
              />

              <Input
                label="Número de Documento"
                name="documentNumber"
                value={currentPassenger.documentNumber}
                onChange={handleChange}
                error={errors.documentNumber}
                placeholder="1234567890"
                required
              />
            </div>

            <Input
              label="Fecha de Nacimiento"
              type="date"
              name="dateOfBirth"
              value={currentPassenger.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              max={new Date().toISOString().split('T')[0]}
              required
            />

            <Button
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
              onClick={handleAddPassenger}
              fullWidth
            >
              Agregar Pasajero
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}