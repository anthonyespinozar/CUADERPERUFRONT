import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useCrud = (service) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await service.getAll();
      setData(Array.isArray(response) ? response : []);
      setIsError(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message);
      setIsError(true);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const create = async (newData) => {
    try {
      setIsLoading(true);
      const response = await service.create(newData);
      toast.success('Registro creado exitosamente');
      await fetchData();
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id, updateData) => {
    try {
      setIsLoading(true);
      const response = await service.update(id, updateData);
      toast.success('Registro actualizado exitosamente');
      await fetchData();
      return response;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      setIsLoading(true);
      await service.delete(id);
      toast.success('Registro eliminado exitosamente');
      await fetchData();
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    isError,
    refresh: fetchData,
    create,
    update,
    remove
  };
}; 