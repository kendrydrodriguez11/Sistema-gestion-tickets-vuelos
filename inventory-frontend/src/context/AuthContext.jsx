import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();

      if (currentUser && authenticated) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    const loggedUser = authService.getCurrentUser();

    setUser(loggedUser);
    setIsAuthenticated(true);

    return data;
  };

  const register = async (formData) => {
    return await authService.register(formData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
