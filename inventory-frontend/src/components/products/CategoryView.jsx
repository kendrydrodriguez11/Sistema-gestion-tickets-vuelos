import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { Category, Inventory } from '@mui/icons-material';
import productService from '../../services/productService';

const CategoryView = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  const categoryList = [
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
    loadCategoryStats();
  }, []);

  const loadCategoryStats = async () => {
    const categoryStats = {};
    
    for (const category of categoryList) {
      try {
        const data = await productService.getProductsByCategory(category, 0, 1);
        categoryStats[category] = data.totalElements || 0;
      } catch (error) {
        console.error(`Error loading category ${category}:`, error);
        categoryStats[category] = 0;
      }
    }
    
    setStats(categoryStats);
    setCategories(categoryList);
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Category sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h4">Categorías de Productos</Typography>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3,
                },
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="div">
                    {category}
                  </Typography>
                  <Inventory color="primary" />
                </Box>
                <Chip
                  label={`${stats[category] || 0} productos`}
                  color={stats[category] > 0 ? 'primary' : 'default'}
                  size="small"
                />
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Ver Productos
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryView;