import { makeGetRequest } from '@/utils/api';

/**
 * Obtener reporte de inventario
 * @param {Object} [params]
 */
export async function getReporteInventario(params = {}) {
  try {
    const data = await makeGetRequest('/api/reportes/inventario', params);
    return data;
  } catch (e) {
    console.error('Error al obtener reporte de inventario:', e);
    throw e;
  }
}

/**
 * Obtener reporte de compras
 * @param {Object} [params] - { desde, hasta, export }
 */
export async function getReporteCompras(params = {}) {
  try {
    const data = await makeGetRequest('/api/reportes/compras', params);
    return data;
  } catch (e) {
    console.error('Error al obtener reporte de compras:', e);
    throw e;
  }
}

  /**
   * Obtener reporte de movimientos de insumos
   * @param {Object} [params] - { material_id, desde, hasta, export }
   */
  export async function getReporteMovimientos(params = {}) {
    try {
      const data = await makeGetRequest('/api/reportes/movimientos', params);
      return data;
    } catch (e) {
      console.error('Error al obtener reporte de movimientos de insumos:', e);
      throw e;
    }
  }

/**
 * Obtener reporte de producción
 * @param {Object} [params] - { estado, export }
 */
export async function getReporteProduccion(params = {}) {
  try {
    const data = await makeGetRequest('/api/reportes/produccion', params);
    return data;
  } catch (e) {
    console.error('Error al obtener reporte de producción:', e);
    throw e;
  }
}

/**
 * Obtener reporte de productos
 * @param {Object} [params] - { estado, export }
 */
export async function getReporteProductos(params = {}) {
  try {
    const data = await makeGetRequest('/api/reportes/productos', params);
    return data;
  } catch (e) {
    console.error('Error al obtener reporte de productos:', e);
    throw e;
  }
}
    /**
   * Obtener reporte de movimientos de productos terminados
   * @param {Object} [params] - { producto_id, desde, hasta, export }
   */
    export async function getReporteMovimientosProductos(params = {}) {
      try {
        const data = await makeGetRequest('/api/reportes/movimientosProductos', params);
        return data;
      } catch (e) {
        console.error('Error al obtener reporte de movimientos de productos terminados:', e);
        throw e;
      }
    }


/**
 * Obtener reporte de clientes
 * @param {Object} [params] - { estado, export }
 */
export async function getReporteClientes(params = {}) {
  try {
    const data = await makeGetRequest('/api/reportes/clientes', params);
    return data;
  } catch (e) {
    console.error('Error al obtener reporte de clientes:', e);
    throw e;
  }
}

/**
 * Obtener reporte de proveedores
 * @param {Object} [params] - { export }
 */
export async function getReporteProveedores(params = {}) {
  try {
    const data = await makeGetRequest('/api/reportes/proveedores', params);
    return data;
  } catch (e) {
    console.error('Error al obtener reporte de proveedores:', e);
    throw e;
  }
}
