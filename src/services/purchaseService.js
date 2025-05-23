import { CrudService } from './crudService';

class PurchaseService extends CrudService {
  constructor() {
    super('/purchases');
  }

  // Métodos específicos para compras
  async getPurchasesByDateRange(startDate, endDate) {
    try {
      const response = await this.api.get(`${this.endpoint}/by-date`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener las compras por rango de fecha');
    }
  }

  async getPurchasesBySupplier(supplierId) {
    try {
      const response = await this.api.get(`${this.endpoint}/by-supplier/${supplierId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener las compras por proveedor');
    }
  }

  async approvePurchase(purchaseId) {
    try {
      const response = await this.api.put(`${this.endpoint}/${purchaseId}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error al aprobar la compra');
    }
  }
}

export const purchaseService = new PurchaseService(); 