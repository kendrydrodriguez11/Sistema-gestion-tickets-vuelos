import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Card, { CardContent, CardHeader, CardTitle } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import useAuthStore from '../store/authStore';
import { formatDate } from '../utils/formatters';
import { validateName, validatePhone, validateEmail } from '../utils/validators';

export default function Profile() {
  const { user, loadUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    newErrors.firstName = validateName(formData.firstName, 'nombre');
    newErrors.lastName = validateName(formData.lastName, 'apellido');
    newErrors.email = validateEmail(formData.email);
    if (formData.phone) {
      newErrors.phone = validatePhone(formData.phone);
    }

    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Por favor corrige los errores');
      return;
    }

    setIsLoading(true);
    try {
      // Aquí iría la llamada a la API para actualizar el perfil
      // await userApi.updateProfile(user.id, formData);
      
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await loadUserProfile();
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal</p>
        </div>

        <div className="grid gap-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit2 className="w-4 h-4" />}
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Save className="w-4 h-4" />}
                      onClick={handleSave}
                      isLoading={isLoading}
                    >
                      Guardar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Nombre"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    disabled={!isEditing}
                    icon={<User className="w-5 h-5" />}
                    required
                  />

                  <Input
                    label="Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    disabled={!isEditing}
                    icon={<User className="w-5 h-5" />}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  disabled={!isEditing}
                  icon={<Mail className="w-5 h-5" />}
                  required
                />

                <Input
                  label="Teléfono"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  disabled={!isEditing}
                  icon={<Phone className="w-5 h-5" />}
                  placeholder="0987654321"
                />
              </div>
            </CardContent>
          </Card>

          {/* Información de la Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Nombre de Usuario
                    </div>
                    <div className="font-semibold">{user.username}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">Estado</div>
                    <Badge variant={user.enabled ? 'success' : 'error'}>
                      {user.enabled ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Fecha de Registro
                    </div>
                    <div className="font-semibold">
                      {formatDate(user.createdAt)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Último Acceso
                    </div>
                    <div className="font-semibold">
                      {user.lastLogin 
                        ? formatDate(user.lastLogin)
                        : 'Primera vez'}
                    </div>
                  </div>
                </div>

                {user.roles && user.roles.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500 mb-2">Roles</div>
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role, index) => (
                        <Badge key={index} variant="info">
                          {role.replace('ROLE_', '')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">0</div>
                  <div className="text-sm text-gray-600">Reservas Totales</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">0</div>
                  <div className="text-sm text-gray-600">Vuelos Completados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">$0</div>
                  <div className="text-sm text-gray-600">Total Gastado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">Contraseña</div>
                    <div className="text-sm text-gray-600">
                      Última actualización hace más de 90 días
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Cambiar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">
                      Autenticación de Dos Factores
                    </div>
                    <div className="text-sm text-gray-600">
                      Agrega una capa extra de seguridad a tu cuenta
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Activar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold mb-1">
                      Sesiones Activas
                    </div>
                    <div className="text-sm text-gray-600">
                      Gestiona los dispositivos donde has iniciado sesión
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferencias */}
          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <div className="font-semibold mb-1">
                      Notificaciones por Email
                    </div>
                    <div className="text-sm text-gray-600">
                      Recibe actualizaciones sobre tus reservas
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <div className="font-semibold mb-1">
                      Ofertas y Promociones
                    </div>
                    <div className="text-sm text-gray-600">
                      Recibe ofertas exclusivas en tu email
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Zona Peligrosa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Zona Peligrosa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <div className="font-semibold text-red-900 mb-1">
                    Eliminar Cuenta
                  </div>
                  <div className="text-sm text-red-700">
                    Esta acción es permanente y no se puede deshacer
                  </div>
                </div>
                <Button variant="danger" size="sm">
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}