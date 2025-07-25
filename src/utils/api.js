import axios from "axios";
import environment from "@/config/environment";
import { authService } from "@/services/authService";

const BASE_URL = environment.url_backend;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Si el token ha expirado o es inválido
      authService.logout();
      return Promise.reject(error);
    }
    
    // Para otros errores, mostrar el mensaje específico
    const errorMessage = error.response?.data?.error || error.message || 'Error en la petición';
    return Promise.reject(new Error(errorMessage));
  }
);

export const makeGetRequest = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
    throw error;
  }
};

export const makePostRequest = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error haciendo la solicitud POST:", error);
    throw error;
  }
};

export const makePutRequest = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Error haciendo la solicitud PUT:", error);
    throw error;
  }
};

export const makeDeleteRequest = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error making DELETE request:", error);
    throw error;
  }
};

export default api;


