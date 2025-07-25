import { useQuery } from "@tanstack/react-query";
import {
  getAllOrdenesProduccion,
  getOrdenProduccionById,
  getMaterialesPorOrden,
} from "@/services/ordenesProduccionService";

/**
 * Hook para obtener todas las órdenes de producción
 */
export const useOrdenesProduccion = () => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["ordenes-produccion"],
    queryFn: getAllOrdenesProduccion,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};

/**
 * Hook para obtener una orden de producción por su ID
 * @param {string|number} id 
 */
export const useOrdenProduccionById = (id) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["orden-produccion", id],
    queryFn: () => getOrdenProduccionById(id),
    enabled: !!id, // solo ejecuta si hay un ID válido
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};

/**
 * Hook para obtener los materiales asociados a una orden específica
 * @param {string|number} id 
 */
export const useMaterialesPorOrden = (id) => {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["materiales-orden", id],
    queryFn: () => getMaterialesPorOrden(id),
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};
