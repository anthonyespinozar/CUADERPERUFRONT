import { useCrud } from './useCrud';
import { inventoryService } from '@/services/inventoryService';
import { toast } from 'sonner';
import { useState } from 'react';

export const useInventory = () => {
  const crudMethods = useCrud(inventoryService);
  const [stockData, setStockData] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [movements, setMovements] = useState([]);

  const getStock = async (productId) => {
    try {
      const data = await inventoryService.getStock(productId);
      setStockData(data);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const adjustStock = async (productId, quantity, reason) => {
    try {
      await inventoryService.adjustStock(productId, quantity, reason);
      toast.success('Stock ajustado exitosamente');
      await getStock(productId); // Actualizar el stock después del ajuste
      await crudMethods.refresh(); // Actualizar la lista general
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const getLowStockItems = async () => {
    try {
      const data = await inventoryService.getLowStockItems();
      setLowStockItems(data);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const getInventoryMovements = async (productId, startDate, endDate) => {
    try {
      const data = await inventoryService.getInventoryMovements(productId, startDate, endDate);
      setMovements(data);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return {
    ...crudMethods,
    stockData,
    lowStockItems,
    movements,
    getStock,
    adjustStock,
    getLowStockItems,
    getInventoryMovements
  };
}; 