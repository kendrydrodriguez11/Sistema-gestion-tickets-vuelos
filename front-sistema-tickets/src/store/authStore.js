import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authApi from '../api/authApi';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      idToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setTokens: (accessToken, idToken = null) => {
        localStorage.setItem('accessToken', accessToken);
        if (idToken) localStorage.setItem('idToken', idToken);
        set({
          accessToken,
          idToken,
          isAuthenticated: true
        });
      },


      loadUserProfile: async () => {
        set({ isLoading: true });
        try {
          const token = localStorage.getItem('accessToken');
          if (!token) throw new Error('No access token available');
          const userData = await authApi.getProfile();
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return userData;
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            idToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message
          });
          localStorage.removeItem('accessToken');
          localStorage.removeItem('idToken');
          throw error;
        }
      },


      logout: () => {
        set({
          user: null,
          accessToken: null,
          idToken: null,
          isAuthenticated: false,
          error: null,
          isLoading: false
        });

        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('user');
      },

      
      clearError: () => set({ error: null }),
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
