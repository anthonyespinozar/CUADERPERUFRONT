import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // Estado de autenticación
      user: null,
      token: null,
      isAuthenticated: false,

      // Estado de la UI
      sidebarOpen: true,
      notifications: [],

      // Acciones de autenticación
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      // Acciones de UI
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // Estado de carga
      loading: false,
      setLoading: (loading) => set({ loading }),

      // Estado de errores
      error: null,
      setError: (error) => set({ error }),
    }),
    {
      name: 'cuaderperu-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useStore; 