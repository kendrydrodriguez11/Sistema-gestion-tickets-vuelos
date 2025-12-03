import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import productService from '../../services/productService';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    minStock: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Electrónicos',
    'Ropa',
    'Alimentos',
    'Hogar',
    'Deportes',
    'Libros',
    'Juguetes',
    'Otro',
  ];

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const product = await productService.getProductById(id);
      setFormData({
        sku: product.sku,
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        minStock: product.minStock || '',
        category: product.category,
      });
    } catch (error) {
      setError('Error al cargar el producto');
      console.error('Error loading product:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('📁 Archivo seleccionado:', file.name, file.type);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minStock: formData.minStock ? parseInt(formData.minStock) : 10,
        image: imageFile // 🔥 Agregado: enviar el File object
      };

      if (isEdit) {
        await productService.updateProduct(id, productData);
        setSuccess('Producto actualizado exitosamente');
      } else {
        console.log('📤 Enviando producto con imagen:', {
          ...productData,
          hasImage: !!imageFile,
          imageType: imageFile?.type
        });
        
        // 🔥 Cambiado: createProduct ahora maneja todo internamente
        await productService.createProduct(productData, 'my-inventory-bucketken');
        
        setSuccess('Producto creado exitosamente');
      }

      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar el producto');
      console.error('❌ Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
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
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                disabled={isEdit || loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                type="number"
                label="Precio"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
                inputProps={{ step: '0.01', min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                type="number"
                label="Stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                disabled={loading}
                inputProps={{ min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Stock Mínimo"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                disabled={loading}
                inputProps={{ min: '0' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Categoría"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {!isEdit && (
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ height: '56px' }}
                >
                  {imageFile ? imageFile.name : 'Seleccionar Imagen'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imageFile && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    ✓ Imagen seleccionada: {imageFile.name}
                  </Typography>
                )}
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={() => navigate('/products')}
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

export default ProductForm;