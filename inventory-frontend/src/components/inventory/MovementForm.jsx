import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import movementService from '../../services/movementService';
import productService from '../../services/productService';

const MovementForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: '',
    type: 'ENTRY',
    quantity: '',
    reason: '',
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const movementTypes = [
    { value: 'ENTRY', label: 'Entrada' },
    { value: 'EXIT', label: 'Salida' },
    { value: 'ADJUSTMENT', label: 'Ajuste' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts(0, 100);
      setProducts(data.content || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Error al cargar productos');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
    setFormData({
      ...formData,
      productId: newValue ? newValue.id : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const movementData = {
        ...formData,
        quantity: parseInt(formData.quantity),
      };

      await movementService.createMovement(movementData);
      setSuccess('Movimiento registrado exitosamente');

      setTimeout(() => {
        navigate('/movements');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al registrar movimiento');
      console.error('Error creating movement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Nuevo Movimiento de Inventario
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} (SKU: ${option.sku})`}
                value={selectedProduct}
                onChange={handleProductChange}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Producto"
                    placeholder="Buscar producto..."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Tipo de Movimiento"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
              >
                {movementTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Cantidad"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                disabled={loading}
                inputProps={{ min: '1' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Razón / Observaciones"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                disabled={loading}
                placeholder="Opcional: Describe el motivo del movimiento..."
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading || !formData.productId}
            >
              {loading ? 'Guardando...' : 'Registrar Movimiento'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={() => navigate('/movements')}
              disabled={loading}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MovementForm;