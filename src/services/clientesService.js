// src/services/clientesService.js

import { makeGetRequest, makePostRequest, makePutRequest,makeDeleteRequest } from '@/utils/api';

/**
 * Obtener todos los clientes
 */
export async function getAllClientes() {
  try {
    const data = await makeGetRequest("/api/clientes");
    return data;
  } catch (e) {
    console.error("Error al obtener clientes:", e);
    throw e;
  }
}

/**
 * Crear un nuevo cliente
 * @param {Object} clienteData - Datos del cliente
 */
export async function createCliente(clienteData) {
  try {
    const response = await makePostRequest("/api/clientes", clienteData);
    return response.cliente;
  } catch (e) {
    console.error("Error al crear cliente:", e);
    throw e;
  }
}

/**
 * Actualizar cliente por ID
 * @param {number|string} id - ID del cliente
 * @param {Object} clienteData - Datos actualizados
 */
export async function updateCliente(id, clienteData) {
  try {
    const response = await makePutRequest(`/api/clientes/${id}`, clienteData);
    return response.cliente;
  } catch (e) {
    console.error("Error al actualizar cliente:", e);
    throw e;
  }
}

/**
 * Cambiar estado (activar/desactivar) del cliente
 * @param {number|string} id - ID del cliente
 * @param {boolean} estado - Nuevo estado (true o false)
 */
export async function toggleClienteEstado(id, estado) {
  try {
    const response = await makePutRequest(`/api/clientes/${id}/status`, { estado });
    return response.cliente;
  } catch (e) {
    console.error("Error al cambiar estado del cliente:", e);
    throw e;
  }
}


/**
 * Eliminar cliente por ID
 * @param {number|string} id - ID del cliente
 */
export async function deleteCliente(id) {
    try {
      const response = await makeDeleteRequest(`/api/clientes/${id}`);
      return response.message;
    } catch (e) {
      console.error("Error al eliminar cliente:", e);
      throw e;
    }
  }
  