import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authApi from '../api/authApi';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.register(userData);
          set({ user, isLoading: false });
          return user;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Error al registrar usuario',
            isLoading: false 
          });
          throw error;
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // Nota: El login con OAuth2 se maneja de forma diferente
          // Este método es para casos especiales o testing
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Error al iniciar sesión',
            isLoading: false 
          });
          throw error;
        }
      },

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ 
          accessToken, 
          refreshToken, 
          isAuthenticated: true 
        });
      },

      loadUserProfile: async () => {
        try {
          // Verificar que el token existe ANTES de hacer la petición
          const token = localStorage.getItem('accessToken');
          
          if (!token) {
            console.error('No access token found in localStorage');
            throw new Error('No access token available');
          }
          
          console.log('Token exists, length:', token.length);
          console.log('Making request to /api/auth/me...');
          
          const userData = await authApi.getProfile();
          
          set({ 
            user: userData, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          console.log('User profile loaded successfully:', userData);
          
          return userData;
        } catch (error) {
          console.error('Failed to load user profile:', error);
          
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
          
          // Limpiar tokens si falla
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;