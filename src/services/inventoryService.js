import { CrudService } from './crudService';

class InventoryService extends CrudService {
  constructor() {
    super('/inventory');
  }

  // Métodos específicos para inventario
  async getStock(productId) {
    try {
      const response = await this.api.get(`${this.endpoint}/stock/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener el stock del producto');
    }
  }

  async adjustStock(productId, quantity, reason) {
    try {
      const response = await this.api.post(`${this.endpoint}/adjust`, {
        productId,
        quantity,
        reason
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al ajustar el stock');
    }
  }

  async getLowStockItems() {
    try {
      const response = await this.api.get(`${this.endpoint}/low-stock`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener items con bajo stock');
    }
  }

  async getInventoryMovements(productId, startDate, endDate) {
    try {
      const response = await this.api.get(`${this.endpoint}/movements`, {
        params: { productId, startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener los movimientos de inventario');
    }
  }
}

export const inventoryService = new InventoryService(); 