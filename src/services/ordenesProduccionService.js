import {
    makeGetRequest,
    makePostRequest,
    makePutRequest,
    makeDeleteRequest
  } from '@/utils/api';
  
  /**
   * Obtener todas las órdenes de producción
   */
  export async function getAllOrdenesProduccion() {
    try {
      const data = await makeGetRequest('/api/ordenes-produccion');
      return data;
    } catch (e) {
      console.error('Error al obtener órdenes de producción:', e);
      throw e;
    }
  }
  
  /**
   * Obtener una orden de producción por ID
   * @param {number|string} id
   */
  export async function getOrdenProduccionById(id) {
    try {
      const data = await makeGetRequest(`/api/ordenes-produccion/${id}`);
      return data;
    } catch (e) {
      console.error('Error al obtener orden por ID:', e);
      throw e;
    }
  }
  
  /**
   * Crear nueva orden de producción
   * @param {object} orden - Objeto con producto_id, cantidad_producir, fecha_programada, cliente_id y materiales
   */
  export async function createOrdenProduccion(orden) {
    try {
      const response = await makePostRequest('/api/ordenes-produccion', orden);
      return response;
    } catch (e) {
      console.error('Error al crear orden de producción:', e);
      throw e;
    }
  }
  
  /**
   * Actualizar orden de producción
   * @param {number|string} id - ID de la orden
   * @param {object} orden - Datos a actualizar (producto_id, cantidad_producir, etc.)
   */
  export async function updateOrdenProduccion(id, orden) {
    try {
      const response = await makePutRequest(`/api/ordenes-produccion/${id}`, orden);
      return response;
    } catch (e) {
      console.error('Error al actualizar orden de producción:', e);
      throw e;
    }
  }
  
  /**
   * Eliminar orden de producción
   * @param {number|string} id - ID de la orden
   */
  export async function deleteOrdenProduccion(id) {
    try {
      const response = await makeDeleteRequest(`/api/ordenes-produccion/${id}`);
      return response.message;
    } catch (e) {
      console.error('Error al eliminar orden de producción:', e);
      throw e;
    }
  }
  
  /**
   * Obtener materiales asociados a una orden
   * @param {number|string} id - ID de la orden
   */
  export async function getMaterialesPorOrden(id) {
    try {
      const data = await makeGetRequest(`/api/ordenes-produccion/${id}/materiales`);
      return data;
    } catch (e) {
      console.error('Error al obtener materiales de la orden:', e);
      throw e;
    }
  }
  