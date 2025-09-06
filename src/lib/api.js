import axios from 'axios';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Si el token ha expirado o es inválido
      console.log('Token expirado o inválido, redirigiendo al login...');
      
      // Limpiar datos de autenticación
      authService.logout();
      
      // Solo mostrar mensaje y redirigir si no estamos ya en la página de login
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        // Mostrar mensaje al usuario
        toast.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', {
          duration: 5000,
        });
        
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 2000);
      }
      
      return Promise.reject(new Error('Sesión expirada. Por favor, inicie sesión nuevamente.'));
    }
    
    // Para otros errores, mostrar el mensaje específico
    const errorMessage = error.response?.data?.error || error.message || 'Error en la petición';
    return Promise.reject(new Error(errorMessage));
  }
);

// Rutas de la API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

export const materialesAPI = {
  getAll: () => api.get('/materiales'),
  getById: (id) => api.get(`/materiales/${id}`),
  create: (data) => api.post('/materiales', data),
  update: (id, data) => api.put(`/materiales/${id}`, data),
  delete: (id) => api.delete(`/materiales/${id}`),
};

export const inventarioAPI = {
  getStock: () => api.get('/inventario/stock'),
  getMovimientos: () => api.get('/inventario/movimientos'),
  registrarMovimiento: (data) => api.post('/inventario/movimientos', data),
};

export const comprasAPI = {
  getAll: () => api.get('/compras'),
  getById: (id) => api.get(`/compras/${id}`),
  create: (data) => api.post('/compras', data),
  update: (id, data) => api.put(`/compras/${id}`, data),
  delete: (id) => api.delete(`/compras/${id}`),
};

export const proveedoresAPI = {
  getAll: () => api.get('/proveedores'),
  getById: (id) => api.get(`/proveedores/${id}`),
  create: (data) => api.post('/proveedores', data),
  update: (id, data) => api.put(`/proveedores/${id}`, data),
  delete: (id) => api.delete(`/proveedores/${id}`),
};

export const ordenesProduccionAPI = {
  getAll: () => api.get('/ordenes-produccion'),
  getById: (id) => api.get(`/ordenes-produccion/${id}`),
  create: (data) => api.post('/ordenes-produccion', data),
  update: (id, data) => api.put(`/ordenes-produccion/${id}`, data),
  delete: (id) => api.delete(`/ordenes-produccion/${id}`),
};

export const produccionesAPI = {
  getAll: () => api.get('/producciones'),
  getById: (id) => api.get(`/producciones/${id}`),
  create: (data) => api.post('/producciones', data),
  update: (id, data) => api.put(`/producciones/${id}`, data),
};

export const reportesAPI = {
  getStockActual: () => api.get('/reportes/stock-actual'),
  getProductosMasProducidos: () => api.get('/reportes/productos-mas-producidos'),
  getConsumoMensual: () => api.get('/reportes/consumo-mensual'),
  getOrdenesProduccion: () => api.get('/reportes/ordenes-produccion'),
};

export const usuariosAPI = {
  getAll: () => api.get('/usuarios'),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post('/usuarios', data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export const auditoriasAPI = {
  getAll: () => api.get('/auditorias'),
  getById: (id) => api.get(`/auditorias/${id}`),
};

export default api; 