import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  TablePagination,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import movementService from '../../services/movementService';

const MovementList = () => {
  const [movements, setMovements] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadMovements();
  }, [page, rowsPerPage]);

  const loadMovements = async () => {
    try {
      const data = await movementService.getAllMovements(page, rowsPerPage);
      setMovements(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Error loading movements:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Movimientos de Inventario
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/movements/new')}
        >
          Nuevo Movimiento
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell>Razón</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay movimientos registrados
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <TableRow key={movement.id} hover>
                  <TableCell>{movement.productName}</TableCell>
                  <TableCell>
                    <Chip
                      label={getMovementTypeLabel(movement.type)}
                      color={getMovementTypeColor(movement.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{movement.quantity}</TableCell>
                  <TableCell>{movement.reason || '-'}</TableCell>
                  <TableCell>
                    {new Date(movement.createdAt).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                </TableRow>
              ))
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

export default MovementList;