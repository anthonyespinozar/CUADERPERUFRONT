// src/services/comprasService.js

import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

/**
 * Obtener todas las compras (con datos de proveedor y material)
 */
export async function getAllCompras() {
  try {
    const data = await makeGetRequest("/api/compras");
    return data;
  } catch (e) {
    console.error("Error al obtener compras:", e);
    throw e;
  }
}

/**
 * Crear una nueva compra
 * @param {Object} compraData - Datos de la compra (proveedor_id, material_id, cantidad, precio_unitario)
 */
export async function createCompra(compraData) {
  try {
    const response = await makePostRequest("/api/compras", compraData);
    return response.compra;
  } catch (e) {
    console.error("Error al registrar compra:", e);
    throw e;
  }
}

/**
 * Actualizar el estado de una compra
 * @param {number|string} id - ID de la compra
 * @param {string} nuevoEstado - nuevo estado (pendiente, recibido, etc.)
 */
export async function updateCompraEstado(id, nuevoEstado) {
  try {
    console.log('=== INICIO ACTUALIZACIÓN ESTADO ===');
    console.log('ID de compra:', id);
    console.log('Nuevo estado:', nuevoEstado);
    console.log('URL:', `/api/compras/${id}/estado`);
    console.log('Datos enviados:', { estado: nuevoEstado });
    
    const response = await makePutRequest(`/api/compras/${id}/estado`, { estado: nuevoEstado });
    
    console.log('Respuesta completa del servidor:', response);
    console.log('Mensaje del servidor:', response.message);
    console.log('Compra actualizada:', response.compra);
    console.log('=== FIN ACTUALIZACIÓN ESTADO ===');
    
    return response.compra;
  } catch (e) {
    console.error("=== ERROR EN ACTUALIZACIÓN ESTADO ===");
    console.error("Error completo:", e);
    console.error("Mensaje de error:", e.message);
    console.error("Respuesta del servidor:", e.response?.data);
    console.error("Status del error:", e.response?.status);
    console.error("=== FIN ERROR ===");
    throw e;
  }
}

/**
 * Actualizar una compra completa
 * @param {number|string} id - ID de la compra
 * @param {Object} compraData - Datos actualizados de la compra
 * 
 * Validaciones que realiza el backend:
 * - Verificar que la compra exista (evitar errores de ID inválido)
 * - Solo permitir si estado = pendiente (garantiza que el inventario no fue afectado)
 * - Eliminar detalles anteriores (reemplazo total de la orden)
 * - Insertar nuevos detalles (actualizar correctamente la compra)
 * 
 * Formato esperado:
 * {
 *   "proveedor_id": 1,
 *   "fecha_estimada_llegada": "2025-07-10",
 *   "observaciones": "Compra de prueba",
 *   "detalles": [
 *     {
 *       "material_id": 1,
 *       "cantidad": 60,
 *       "precio_unitario": 13.0
 *     }
 *   ]
 * }
 */
export async function updateCompra(id, compraData) {
  try {
    const response = await makePutRequest(`/api/compras/${id}`, compraData);
    return response.compra;
  } catch (e) {
    console.error("Error al actualizar compra:", e);
    throw e;
  }
}

/**
 * Eliminar una compra
 * @param {number|string} id - ID de la compra
 */
export async function deleteCompra(id) {
  try {
    const response = await makeDeleteRequest(`/api/compras/${id}`);
    return response;
  } catch (e) {
    console.error("Error al eliminar compra:", e);
    throw e;
  }
}
