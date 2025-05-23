import api from '@/utils/api';

export class CrudService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAll(params = {}) {
    try {
      const response = await api.get(this.endpoint, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Error al obtener los ${this.endpoint}`);
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Error al obtener el ${this.endpoint}`);
    }
  }

  async create(data) {
    try {
      const response = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Error al crear el ${this.endpoint}`);
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Error al actualizar el ${this.endpoint}`);
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || `Error al eliminar el ${this.endpoint}`);
    }
  }
} 