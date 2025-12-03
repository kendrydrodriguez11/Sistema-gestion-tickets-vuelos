import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  alpha,
  LinearProgress,
} from '@mui/material';
import {
  Inventory,
  TrendingUp,
  Warning,
  ShoppingCart,
  TrendingDown,
} from '@mui/icons-material';
import productService from '../../services/productService';
import movementService from '../../services/movementService';
import notificationService from '../../services/notificationService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    recentMovements: 0,
    unreadNotifications: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsData, lowStockData, movementsData, notifCount] = await Promise.all([
        productService.getAllProducts(0, 1),
        productService.getLowStockProducts(0, 5),
        movementService.getAllMovements(0, 5),
        notificationService.getUnreadCount(),
      ]);

      setStats({
        totalProducts: productsData.totalElements || 0,
        lowStock: lowStockData.totalElements || 0,
        recentMovements: movementsData.totalElements || 0,
        unreadNotifications: notifCount || 0,
      });

      setLowStockProducts(lowStockData.content || []);
      setRecentMovements(movementsData.content || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const StatCard = ({ title, value, icon, gradient, onClick }) => (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        background: gradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: onClick ? 'translateY(-8px)' : 'none',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '195px',
          height: '195px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          transform: 'translate(40%, -40%)',
        }
      }} 
      onClick={onClick}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.9,
                mb: 1,
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                mb: 1,
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '16px',
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800,
            mb: 1,
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resumen general de tu inventario
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Productos"
            value={stats.totalProducts}
            icon={<Inventory sx={{ fontSize: 32, color: 'white' }} />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            onClick={() => navigate('/products')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Stock Bajo"
            value={stats.lowStock}
            icon={<Warning sx={{ fontSize: 32, color: 'white' }} />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            onClick={() => navigate('/low-stock')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Movimientos"
            value={stats.recentMovements}
            icon={<TrendingUp sx={{ fontSize: 32, color: 'white' }} />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            onClick={() => navigate('/movements')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Notificaciones"
            value={stats.unreadNotifications}
            icon={<ShoppingCart sx={{ fontSize: 32, color: 'white' }} />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            onClick={() => navigate('/notifications')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (theme) => alpha(theme.palette.error.main, 0.1),
                }}
              >
                <TrendingDown sx={{ color: 'error.main', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Stock Bajo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Productos que requieren atención
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {lowStockProducts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    ✓ No hay productos con stock bajo
                  </Typography>
                </Box>
              ) : (
                lowStockProducts.map((product) => (
                  <ListItem
                    key={product.id}
                    button
                    onClick={() => navigate(`/products/${product.id}`)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Stock: {product.stock} / {product.minStock}
                            </Typography>
                            <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                              {Math.round((product.stock / product.minStock) * 100)}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min((product.stock / product.minStock) * 100, 100)}
                            sx={{
                              height: 6,
                              borderRadius: 1,
                              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 1,
                                backgroundColor: 'error.main',
                              }
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (theme) => alpha(theme.palette.info.main, 0.1),
                }}
              >
                <TrendingUp sx={{ color: 'info.main', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Actividad Reciente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Últimos movimientos registrados
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {recentMovements.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No hay movimientos recientes
                  </Typography>
                </Box>
              ) : (
                recentMovements.map((movement) => (
                  <ListItem 
                    key={movement.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: (theme) => alpha(theme.palette.background.default, 0.5),
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {movement.productName}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                          <Typography 
                            variant="caption" 
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontWeight: 600,
                              backgroundColor: movement.type === 'ENTRY' 
                                ? (theme) => alpha(theme.palette.success.main, 0.1)
                                : (theme) => alpha(theme.palette.error.main, 0.1),
                              color: movement.type === 'ENTRY' ? 'success.main' : 'error.main',
                            }}
                          >
                            {movement.type === 'ENTRY' ? '↑ Entrada' : movement.type === 'EXIT' ? '↓ Salida' : 'Ajuste'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Cantidad: {movement.quantity}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;