import axios from "axios";
import environment from "@/config/environment";
import { authService } from "@/services/authService";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
    throw new Error(error.message || 'Error al obtener los datos');
  }
};

export const makePostRequest = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al enviar los datos');
  }
};

export const makePutRequest = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al actualizar los datos');
  }
};

export const makeDeleteRequest = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Error al eliminar los datos');
  }
};

export default api;

export function useUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const data = await userService.getUsers()
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.error("Los datos recibidos no son un array:", data)
        setUsers([])
      }
      setIsError(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error(error.message)
      setIsError(true)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const mutate = async () => {
    await fetchUsers()
  }

  return { users, isLoading, isError, mutate }
}
