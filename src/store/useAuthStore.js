import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { makePostRequest } from '@/lib/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (correo, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await makePostRequest('/api/auth/login', { correo, password });
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          });
          return response;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      hasPermission: (requiredRole) => {
        const state = useAuthStore.getState();
        if (!state.user) return false;
        return state.user.rol === requiredRole;
      },

      isAdmin: () => {
        const state = useAuthStore.getState();
        return state.user?.rol === 'admin';
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore; 