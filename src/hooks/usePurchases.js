import { useCrud } from './useCrud';
import { purchaseService } from '@/services/purchaseService';
import { toast } from 'sonner';
import { useState } from 'react';

export const usePurchases = () => {
  const crudMethods = useCrud(purchaseService);
  const [dateRangeData, setDateRangeData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);

  const getPurchasesByDateRange = async (startDate, endDate) => {
    try {
      const data = await purchaseService.getPurchasesByDateRange(startDate, endDate);
      setDateRangeData(data);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const getPurchasesBySupplier = async (supplierId) => {
    try {
      const data = await purchaseService.getPurchasesBySupplier(supplierId);
      setSupplierData(data);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const approvePurchase = async (purchaseId) => {
    try {
      await purchaseService.approvePurchase(purchaseId);
      toast.success('Compra aprobada exitosamente');
      await crudMethods.refresh(); // Actualizar la lista después de aprobar
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return {
    ...crudMethods,
    dateRangeData,
    supplierData,
    getPurchasesByDateRange,
    getPurchasesBySupplier,
    approvePurchase
  };
}; 