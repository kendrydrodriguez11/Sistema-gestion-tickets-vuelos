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
        set({ isLoading: true });
        try {
          const user = await authApi.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          set({ 
            isAuthenticated: false,
            user: null,
            isLoading: false 
          });
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