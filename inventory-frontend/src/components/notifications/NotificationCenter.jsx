import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Chip,
  Button,
  Divider,
  TablePagination,
} from '@mui/material';
import {
  Notifications,
  Warning,
  Info,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import notificationService from '../../services/notificationService';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  useEffect(() => {
    loadNotifications();
  }, [page, rowsPerPage, filter]);

  const loadNotifications = async () => {
    try {
      let data;
      if (filter === 'unread') {
        data = await notificationService.getUnreadNotifications(page, rowsPerPage);
      } else {
        data = await notificationService.getAllNotifications(page, rowsPerPage);
      }
      setNotifications(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'LOW_STOCK':
        return <Warning color="warning" />;
      case 'OUT_OF_STOCK':
        return <Error color="error" />;
      case 'SYSTEM_ALERT':
        return <Info color="info" />;
      case 'ORDER_UPDATE':
        return <CheckCircle color="success" />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'LOW_STOCK':
        return 'Stock Bajo';
      case 'OUT_OF_STOCK':
        return 'Sin Stock';
      case 'SYSTEM_ALERT':
        return 'Alerta del Sistema';
      case 'ORDER_UPDATE':
        return 'Actualización';
      case 'PRICE_CHANGE':
        return 'Cambio de Precio';
      default:
        return type;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Centro de Notificaciones</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => {
              setFilter('all');
              setPage(0);
            }}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'unread' ? 'contained' : 'outlined'}
            onClick={() => {
              setFilter('unread');
              setPage(0);
            }}
          >
            No Leídas
          </Button>
          <Button variant="outlined" onClick={handleMarkAllAsRead}>
            Marcar Todas como Leídas
          </Button>
        </Box>
      </Box>

      <Paper>
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No hay notificaciones"
                sx={{ textAlign: 'center' }}
              />
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  button
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  sx={{
                    bgcolor: notification.read ? 'inherit' : 'action.hover',
                  }}
                >
                  <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">{notification.title}</Typography>
                        <Chip
                          label={getNotificationTypeLabel(notification.type)}
                          size="small"
                          color={notification.read ? 'default' : 'primary'}
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString('es-ES')}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
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
      </Paper>
    </Container>
  );
};

export default NotificationCenter;