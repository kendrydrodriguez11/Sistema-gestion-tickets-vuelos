import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Logout,
  Person,
  Inventory2,
} from '@mui/icons-material';
import notificationService from '../../services/notificationService';
import websocketService from '../../services/websocketService';

const Navbar = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUnreadCount();
    
    websocketService.connect(
      () => {
        websocketService.subscribeToNotifications((notification) => {
          setUnreadCount((prev) => prev + 1);
          setNotifications((prev) => [notification, ...prev]);
        });
      },
      (error) => console.error('WebSocket error:', error)
    );

    return () => websocketService.disconnect();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  
  const handleNotifMenu = async (event) => {
    setNotifAnchorEl(event.currentTarget);
    try {
      const data = await notificationService.getUnreadNotifications(0, 5);
      setNotifications(data.content || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleClose = () => setAnchorEl(null);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleNotificationClick = async (notif) => {
    try {
      await notificationService.markAsRead(notif.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      handleNotifClose();
      navigate('/notifications');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(20px)',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="primary"
            edge="start"
            onClick={onMenuClick}
            sx={{ 
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Inventory2 sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Inventario Pro
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            color="primary"
            onClick={handleNotifMenu}
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleNotifClose}
            PaperProps={{
              sx: {
                maxHeight: 400,
                width: '380px',
                mt: 1,
                borderRadius: 3,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Notificaciones
              </Typography>
            </Box>
            <Divider />
            {notifications.length === 0 ? (
              <MenuItem>
                <Typography color="text.secondary">No hay notificaciones</Typography>
              </MenuItem>
            ) : (
              notifications.map((notif) => (
                <MenuItem
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  sx={{ 
                    py: 2,
                    whiteSpace: 'normal',
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {notif.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {notif.message}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          <IconButton 
            onClick={handleMenu}
            sx={{
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              {user?.sub?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 3,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.sub}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Usuario activo
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mi Perfil</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Cerrar Sesión</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;