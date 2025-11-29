// src/services/movimientosProductosService.js

import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from "@/utils/api";

/**
 * Obtener movimientos de productos
 * @param {Object} filtros - Filtros opcionales { tipo, producto_id, origen, fecha_desde, fecha_hasta }
 */
export async function getAllMovimientosProductos(filtros = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.producto_id) params.append('producto_id', filtros.producto_id);
    if (filtros.origen) params.append('origen', filtros.origen);
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
    
    const queryString = params.toString();
    const url = queryString ? `/api/movimientos-productos?${queryString}` : "/api/movimientos-productos";
    
    const data = await makeGetRequest(url);
    return data;
  } catch (e) {
    console.error("Error al obtener movimientos de productos:", e);
    throw e;
  }
}

/**
 * Crear un nuevo movimiento
 * @param {Object} movimientoData - { producto_id, tipo, cantidad, motivo }
 */
export async function createMovimientoProducto(movimientoData) {
  try {
    const response = await makePostRequest("/api/movimientos-productos", movimientoData);
    return response;
  } catch (e) {
    console.error("Error al crear movimiento:", e);
    throw e;
  }
}

/**
 * Actualizar un movimiento existente
 * @param {number|string} id - ID del movimiento
 * @param {Object} movimientoData - { tipo, cantidad, motivo }
 */
export async function updateMovimientoProducto(id, movimientoData) {
  try {
    const response = await makePutRequest(`/api/movimientos-productos/${id}`, movimientoData);
    return response;
  } catch (e) {
    console.error("Error al actualizar movimiento:", e);
    throw e;
  }
}

/**
 * Eliminar movimiento (revierte stock automáticamente)
 * @param {number|string} id - ID del movimiento
 */
export async function deleteMovimientoProducto(id) {
  try {
    const response = await makeDeleteRequest(`/api/movimientos-productos/${id}`);
    return response.message;
  } catch (e) {
    console.error("Error al eliminar movimiento:", e);
    throw e;
  }
}
