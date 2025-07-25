// src/services/movimientosService.js

import { makeGetRequest, makePostRequest, makeDeleteRequest } from '@/utils/api';

/**
 * Obtener todos los movimientos de inventario
 */
export async function getAllMovimientos() {
  try {
    const data = await makeGetRequest("/api/movimientos");
    return data;
  } catch (e) {
    console.error("Error al obtener movimientos:", e);
    throw e;
  }
}

/**
 * Crear un nuevo movimiento de inventario
 * @param {Object} movimientoData - Datos del movimiento
 */
export async function createMovimiento(movimientoData) {
  try {
    const response = await makePostRequest("/api/movimientos", movimientoData);
    return response.movimiento;
  } catch (e) {
    console.error("Error al crear movimiento:", e);
    throw e;
  }
}

/**
 * Eliminar un movimiento de inventario por ID
 * @param {number|string} id - ID del movimiento
 */
export async function deleteMovimiento(id) {
  try {
    const response = await makeDeleteRequest(`/api/movimientos/${id}`);
    return response.message;
  } catch (e) {
    console.error("Error al eliminar movimiento:", e);
    throw e;
  }
}
