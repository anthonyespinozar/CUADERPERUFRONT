import axios from 'axios';

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