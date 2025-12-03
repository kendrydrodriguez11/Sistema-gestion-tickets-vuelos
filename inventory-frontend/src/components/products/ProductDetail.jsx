import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  Edit,
  ArrowBack,
  Inventory,
  Category,
  AttachMoney,
} from '@mui/icons-material';
import productService from '../../services/productService';
import movementService from '../../services/movementService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    try {
      const [productData, movementsData] = await Promise.all([
        productService.getProductById(id),
        movementService.getMovementsByProduct(id, 0, 5),
      ]);
      
      setProduct(productData);
      setMovements(movementsData.content || []);
    } catch (error) {
      console.error('Error loading product detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'default';
      case 'OUT_OF_STOCK':
        return 'error';
      case 'DISCONTINUED':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo';
      case 'INACTIVE':
        return 'Inactivo';
      case 'OUT_OF_STOCK':
        return 'Sin Stock';
      case 'DISCONTINUED':
        return 'Descontinuado';
      default:
        return status;
    }
  };

  const getMovementTypeLabel = (type) => {
    switch (type) {
      case 'ENTRY':
        return 'Entrada';
      case 'EXIT':
        return 'Salida';
      case 'ADJUSTMENT':
        return 'Ajuste';
      default:
        return type;
    }
  };

  const getMovementTypeColor = (type) => {
    switch (type) {
      case 'ENTRY':
        return 'success';
      case 'EXIT':
        return 'error';
      case 'ADJUSTMENT':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Cargando...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Producto no encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/products/edit/${id}`)}
        >
          Editar
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            {product.imageUrl ? (
              <CardMedia
                component="img"
                height="300"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 2 }}
              />
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.200',
                }}
              >
                <Inventory sx={{ fontSize: 100, color: 'grey.400' }} />
              </Box>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            
            <Chip
              label={getStatusLabel(product.status)}
              color={getStatusColor(product.status)}
              sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
                    SKU:
                  </Typography>
                  <Typography variant="body1">{product.sku}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Category sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
                    Categoría:
                  </Typography>
                  <Typography variant="body1">{product.category}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
                    Precio:
                  </Typography>
                  <Typography variant="body1">${product.price.toFixed(2)}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Inventory sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
                    Stock:
                  </Typography>
                  <Chip
                    label={product.stock}
                    color={product.stock <= product.minStock ? 'error' : 'success'}
                    size="small"
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Descripción:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description || 'Sin descripción'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Movimientos Recientes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {movements.length === 0 ? (
              <Typography color="text.secondary">
                No hay movimientos registrados
              </Typography>
            ) : (
              movements.map((movement) => (
                <Box key={movement.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Chip
                        label={getMovementTypeLabel(movement.type)}
                        color={getMovementTypeColor(movement.type)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" component="span">
                        Cantidad: {movement.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(movement.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  {movement.reason && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Razón: {movement.reason}
                    </Typography>
                  )}
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;