import {
    makeGetRequest,
    makePostRequest,
    makePutRequest,
    makeDeleteRequest,
  } from '@/utils/api';
  
  /**
   * Obtener todas las producciones realizadas
   */
  export async function getAllProducciones() {
    try {
      const data = await makeGetRequest("/api/producciones");
      return data;
    } catch (e) {
      console.error("Error al obtener producciones:", e);
      throw e;
    }
  }
  
  /**
   * Iniciar una orden de producción
   * @param {number|string} ordenId - ID de la orden a iniciar
   */
  export async function iniciarProduccion(ordenId) {
    try {
      const response = await makePutRequest(`/api/producciones/iniciar/${ordenId}`);
      return response;
    } catch (e) {
      console.error("Error al iniciar producción:", e);
      throw e;
    }
  }
  
  /**
   * Registrar una producción parcial o total
   * @param {number|string} ordenId - ID de la orden
   * @param {Object} produccionData - Datos de la producción { cantidad_producida, fecha_produccion }
   */
  export async function registrarProduccion(ordenId, produccionData) {
    try {
      const response = await makePostRequest(`/api/producciones/registrar/${ordenId}`, produccionData);
      return response;
    } catch (e) {
      console.error("Error al registrar producción:", e);
      throw e;
    }
  }
  
  /**
   * Finalizar manualmente una producción
   * @param {number|string} ordenId - ID de la orden
   */
  export async function finalizarProduccion(ordenId) {
    try {
      const response = await makePutRequest(`/api/producciones/finalizar/${ordenId}`);
      return response;
    } catch (e) {
      console.error("Error al finalizar producción:", e);
      throw e;
    }
  }
  
  /**
   * Editar una producción registrada
   * @param {number|string} produccionId - ID de la producción
   * @param {Object} produccionData - Datos actualizados { cantidad_producida, fecha_produccion }
   */
  export async function editarProduccion(produccionId, produccionData) {
    try {
      const response = await makePutRequest(`/api/producciones/${produccionId}`, produccionData);
      return response;
    } catch (e) {
      console.error("Error al editar producción:", e);
      throw e;
    }
  }
  
  /**
   * Eliminar una producción registrada
   * @param {number|string} produccionId - ID de la producción
   */
  export async function eliminarProduccion(produccionId) {
    try {
      const data = await makeDeleteRequest(`/api/producciones/${produccionId}`);
      return data;
    } catch (e) {
      console.error("Error al eliminar producción:", e);
      throw e;
    }
  }
  