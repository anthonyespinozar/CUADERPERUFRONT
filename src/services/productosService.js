// src/services/productosService.js

import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from "@/utils/api";

/**
 * Obtener todos los productos
 */
export async function getAllProductos() {
  try {
    const data = await makeGetRequest("/api/productos");
    return data;
  } catch (e) {
    console.error("Error al obtener productos:", e);
    throw e;
  }
}

/**
 * Crear un nuevo producto
 * @param {Object} productoData - Datos del producto
 */
export async function createProducto(productoData) {
  try {
    // Asegurar valores válidos para el controlador
    const payload = {
      ...productoData,
      // Asegurar que precio_unitario sea un número válido
      precio_unitario: productoData.precio_unitario !== null && productoData.precio_unitario !== undefined 
        ? Number(productoData.precio_unitario) 
        : 0,
      // Asegurar que stock_actual sea un número válido
      stock_actual: productoData.stock_actual !== null && productoData.stock_actual !== undefined 
        ? Number(productoData.stock_actual) 
        : 0
    };
    
    const response = await makePostRequest("/api/productos", payload);
    return response;
  } catch (e) {
    console.error("Error al crear producto:", e);
    throw e;
  }
}

/**
 * Actualizar producto por ID
 * @param {number|string} id - ID del producto
 * @param {Object} productoData - Datos actualizados
 */
export async function updateProducto(id, productoData) {
  try {
    // Asegurar valores válidos para el controlador
    const payload = {
      ...productoData,
      // Asegurar que precio_unitario sea un número válido
      precio_unitario: productoData.precio_unitario !== null && productoData.precio_unitario !== undefined 
        ? Number(productoData.precio_unitario) 
        : 0,
      // Asegurar que stock_actual sea un número válido
      stock_actual: productoData.stock_actual !== null && productoData.stock_actual !== undefined 
        ? Number(productoData.stock_actual) 
        : 0
    };
    
    const response = await makePutRequest(`/api/productos/${id}`, payload);
    return response;
  } catch (e) {
    console.error("Error al actualizar producto:", e);
    throw e;
  }
}

/**
 * Eliminar (desactivar) producto por ID
 * @param {number|string} id - ID del producto
 */
export async function deleteProducto(id) {
  try {
    const response = await makeDeleteRequest(`/api/productos/${id}`);
    return response.message;
  } catch (e) {
    console.error("Error al eliminar producto:", e);
    throw e;
  }
}

/**
 * Cambiar estado del producto (activar/desactivar)
 * @param {number|string} id - ID del producto
 * @param {boolean} estado - Nuevo estado (true = activo, false = inactivo)
 */
export async function toggleProductoEstado(id, estado) {
  try {
    // Primero obtener el producto actual para mantener sus datos
    const productos = await getAllProductos();
    const productoActual = productos.find(p => p.id === parseInt(id));
    
    if (!productoActual) {
      throw new Error('Producto no encontrado');
    }

    // Enviar el estado nuevo junto con los datos actuales del producto
    const response = await makePutRequest(`/api/productos/${id}`, { 
      estado,
      stock_actual: productoActual.stock_actual,
      precio_unitario: productoActual.precio_unitario,
      nombre: productoActual.nombre,
      descripcion: productoActual.descripcion,
      unidad_medida: productoActual.unidad_medida
    });
    return response;
  } catch (e) {
    console.error("Error al cambiar estado del producto:", e);
    throw e;
  }
}

/**
 * Registrar movimiento manual para un producto
 * @param {Object} movimientoData - { producto_id, tipo, cantidad, motivo }
 */
export async function registrarMovimiento(movimientoData) {
  try {
    const response = await makePostRequest("/api/movimientos-productos", movimientoData);
    return response;
  } catch (e) {
    console.error("Error al registrar movimiento:", e);
    throw e;
  }
}
