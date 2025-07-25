// src/services/proveedoresService.js

import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

/**
 * Obtener todos los proveedores
 */
export async function getAllProveedores() {
  try {
    const data = await makeGetRequest("/api/proveedores");
    return data;
  } catch (e) {
    console.error("Error al obtener proveedores:", e);
    throw e;
  }
}

/**
 * Crear un nuevo proveedor
 * @param {Object} proveedorData - Datos del proveedor
 */
export async function createProveedor(proveedorData) {
  try {
    const response = await makePostRequest("/api/proveedores", proveedorData);
    return response.proveedor;
  } catch (e) {
    console.error("Error al crear proveedor:", e);
    throw e;
  }
}

/**
 * Actualizar proveedor por ID
 * @param {number|string} id - ID del proveedor
 * @param {Object} proveedorData - Datos actualizados
 */
export async function updateProveedor(id, proveedorData) {
  try {
    const response = await makePutRequest(`/api/proveedores/${id}`, proveedorData);
    return response.proveedor;
  } catch (e) {
    console.error("Error al actualizar proveedor:", e);
    throw e;
  }
} 


/**
 * Cambiar estado (activar/desactivar) del proveedor
 * @param {number|string} id - ID del proveedor
 * @param {boolean} estado - Nuevo estado
 */
export async function toggleProveedorEstado(id, estado) {
  try {
    const response = await makePutRequest(`/api/proveedores/${id}/status`, { estado });
    return response.proveedor;
  } catch (e) {
    console.error("Error al cambiar estado del proveedor:", e);
    throw e;
  }
}

/**
 * Eliminar proveedor por ID
 * @param {number|string} id - ID del proveedor
 */
export async function deleteProveedor(id) {
  try {
    const response = await makeDeleteRequest(`/api/proveedores/${id}`);
    return response.message;
  } catch (e) {
    console.error("Error al eliminar proveedor:", e);
    throw e;
  }
}