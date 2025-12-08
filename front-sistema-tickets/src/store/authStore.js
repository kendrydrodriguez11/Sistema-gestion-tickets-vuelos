import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authApi from '../api/authApi';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      accessToken: null,
      idToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Guardar tokens de Auth0
      setTokens: (accessToken, idToken = null) => {
        console.log('🔐 Guardando tokens de Auth0...');
        
        // Guardar en localStorage
        localStorage.setItem('accessToken', accessToken);
        if (idToken) {
          localStorage.setItem('idToken', idToken);
        }
        
        // Actualizar estado
        set({ 
          accessToken, 
          idToken,
          isAuthenticated: true 
        });
        
        console.log('✅ Tokens guardados correctamente');
      },

      // Cargar perfil del usuario desde Auth0
      loadUserProfile: async () => {
        console.log('👤 Cargando perfil del usuario...');
        set({ isLoading: true });
        
        try {
          const token = localStorage.getItem('accessToken');
          
          if (!token) {
            console.error('❌ No hay token en localStorage');
            throw new Error('No access token available');
          }
          
          console.log('✓ Token encontrado, haciendo petición a /api/auth/me...');
          
          // Obtener perfil del usuario
          const userData = await authApi.getProfile();
          
          console.log('✅ Perfil cargado:', userData);
          
          set({ 
            user: userData, 
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return userData;
          
        } catch (error) {
          console.error('❌ Error cargando perfil:', error.message);
          
          // Limpiar en caso de error
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false,
            accessToken: null,
            idToken: null,
            error: error.message
          });
          
          localStorage.removeItem('accessToken');
          localStorage.removeItem('idToken');
          
          throw error;
        }
      },

      // Cerrar sesión
      logout: () => {
        console.log('👋 Cerrando sesión...');
        
        // Limpiar estado
        set({
          user: null,
          accessToken: null,
          idToken: null,
          isAuthenticated: false,
          error: null,
          isLoading: false
        });
        
        // Limpiar localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('user');
        
        console.log('✅ Sesión cerrada');
      },

      // Limpiar errores
      clearError: () => set({ error: null }),

      // Verificar si el token aún es válido (opcional)
      isTokenValid: () => {
        const token = localStorage.getItem('accessToken');
        return !!token;
      }
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