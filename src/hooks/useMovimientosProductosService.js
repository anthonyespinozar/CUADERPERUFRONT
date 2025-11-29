import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMovimientosProductos,
  createMovimientoProducto,
  updateMovimientoProducto,
  deleteMovimientoProducto
} from "@/services/movimientosProductosService";

export const useMovimientosProductos = (filtros = {}) => {
  const {isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["movimientosProductos", filtros],
    queryFn: () => getAllMovimientosProductos(filtros),
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};

export const useCreateMovimientoProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createMovimientoProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientosProductos"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};

export const useUpdateMovimientoProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, movimientoData }) => updateMovimientoProducto(id, movimientoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientosProductos"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};

export const useDeleteMovimientoProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteMovimientoProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientosProductos"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};