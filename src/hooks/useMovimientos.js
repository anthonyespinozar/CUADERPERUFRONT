import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMovimientos, createMovimiento, editMovimiento, deleteMovimiento } from "@/services/movimientosService";

export const useMovimientos = () => {
  const {isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["movimientos"],
    queryFn: getAllMovimientos,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};

// Hook para crear movimiento con invalidación automática
export const useCreateMovimiento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createMovimiento,
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
};

// Hook para editar movimiento con invalidación automática
export const useEditMovimiento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => editMovimiento(id, data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
};

// Hook para eliminar movimiento con invalidación automática
export const useDeleteMovimiento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteMovimiento,
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
};