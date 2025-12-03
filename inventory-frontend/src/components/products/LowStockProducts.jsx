import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Chip,
  TablePagination,
  Alert,
} from '@mui/material';
import { Visibility, Warning } from '@mui/icons-material';
import productService from '../../services/productService';

const LowStockProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadLowStockProducts();
  }, [page, rowsPerPage]);

  const loadLowStockProducts = async () => {
    try {
      const data = await productService.getLowStockProducts(page, rowsPerPage);
      setProducts(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Error loading low stock products:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStockLevel = (stock, minStock) => {
    const percentage = (stock / minStock) * 100;
    if (percentage === 0) return { label: 'Sin Stock', color: 'error' };
    if (percentage <= 50) return { label: 'Crítico', color: 'error' };
    if (percentage <= 100) return { label: 'Bajo', color: 'warning' };
    return { label: 'Normal', color: 'success' };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Warning sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
        <Typography variant="h4">Productos con Stock Bajo</Typography>
      </Box>

      {products.length === 0 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ¡Excelente! No hay productos con stock bajo en este momento.
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Stock Actual</TableCell>
              <TableCell align="right">Stock Mínimo</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay productos con stock bajo
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const level = getStockLevel(product.stock, product.minStock);
                return (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{
                      bgcolor: level.color === 'error' ? 'error.lighter' : 'warning.lighter',
                    }}
                  >
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">
                      <Chip label={product.stock} color={level.color} size="small" />
                    </TableCell>
                    <TableCell align="right">{product.minStock}</TableCell>
                    <TableCell>
                      <Chip label={level.label} color={level.color} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      </TableContainer>
    </Container>
  );
};

export default LowStockProducts;