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
      setTokens: (accessToken, refreshToken) => {
        console.log('🔐 Setting tokens in store...');
        
        // Guardar en localStorage PRIMERO
        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        // Luego actualizar el state
        set({ 
          accessToken, 
          refreshToken, 
          isAuthenticated: true 
        });
        
        console.log('✅ Tokens set successfully');
      },

      loadUserProfile: async () => {
        console.log('👤 Loading user profile...');
        
        try {
          // CRÍTICO: Verificar token ANTES de hacer la petición
          const token = localStorage.getItem('accessToken');
          
          if (!token) {
            console.error('❌ No access token found in localStorage');
            throw new Error('No access token available');
          }
          
          console.log('✓ Token exists in localStorage, length:', token.length);
          console.log('✓ Making request to /api/auth/me...');
          
          // Hacer la petición
          const userData = await authApi.getProfile();
          
          console.log('✅ User profile loaded successfully:', userData);
          
          set({ 
            user: userData, 
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return userData;
          
        } catch (error) {
          console.error('❌ Failed to load user profile');
          console.error('Error type:', error.name);
          console.error('Error message:', error.message);
          
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
          }
          
          // Limpiar estado en caso de error
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false,
            accessToken: null,
            refreshToken: null,
            error: error.message
          });
          
          // Limpiar tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          throw error;
        }
      },

      logout: () => {
        console.log('👋 Logging out...');
        
        authApi.logout();
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null
        });
        
        console.log('✅ Logged out successfully');
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