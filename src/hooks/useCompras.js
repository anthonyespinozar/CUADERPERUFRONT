import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCompras, createCompra, updateCompra, updateCompraEstado, deleteCompra } from "@/services/comprasService";

export const useCompras = () => {
  const {isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["compras"],
    queryFn: getAllCompras,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};

// Hook para crear compra con invalidación automática
export const useCreateCompra = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCompra,
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
};

// Hook para editar compra con invalidación automática
export const useUpdateCompra = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => updateCompra(id, data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
};

// Hook para actualizar estado de compra con invalidación automática
export const useUpdateCompraEstado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, estado }) => updateCompraEstado(id, estado),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
};

// Hook para eliminar compra con invalidación automática
export const useDeleteCompra = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCompra,
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
};