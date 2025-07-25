import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

/**
 * Obtener todos los materiales
 */
export async function getAllMateriales() {
  try {
    const data = await makeGetRequest("/api/materiales");

    return data;
  } catch (e) {
    console.error('Error al obtener materiales:', e);
    throw e;
  }
}

export async function getAllMaterialesActivos() {
  try {
    const data = await makeGetRequest("/api/materiales/activos");
    return data;
  } catch (e) {
    console.error('Error al obtener materiales:', e);
    throw e;
  }
}

/**
 * Crear un nuevo materiales (material)
 * @param {Object} materialData - Objeto con los datos del materiales
 */
export async function createMateriales(materialData) {
  try {
    const response = await makePostRequest("/api/materiales", materialData);
    return response.material;
  } catch (e) {
    console.error('Error al crear material:', e);
    throw e;
  }
}

/**
 * Actualizar materiales por ID
 * @param {number|string} id - ID del materiales
 * @param {Object} materialData - Datos actualizados
 */
export async function updateMateriales(id, materialData) {
  try {
    const response = await makePutRequest(`/api/materiales/${id}`, materialData);
    return response.material;
  } catch (e) {
    console.error('Error al actualizar material:', e);
    throw e;
  }
}

export async function toggleMaterialStatus(id, newStatus) {
  try {
    const response = await makePutRequest(`/api/materiales/${id}/status`, { estado: newStatus });
    return response.material;
  } catch (e) {
    console.error('Error al cambiar estado del material:', e);
    throw e;
  }
}

/**
 * Eliminar materiales por ID
 * @param {number|string} id
 */
export async function deleteMateriales(id) {
  try {
    const data = await makeDeleteRequest(`/api/materiales/${id}`);
    return data;
  } catch (e) {
    console.error('Error al eliminar materiales:', e);
    throw e;
  }
}
