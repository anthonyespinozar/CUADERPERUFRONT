import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllProductos, 
  createProducto, 
  updateProducto, 
  deleteProducto,
  toggleProductoEstado,
  registrarMovimiento 
} from "@/services/productosService";

export const useProductos = () => {
  const {isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["productos"],
    queryFn: getAllProductos,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, productoData }) => updateProducto(id, productoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};

export const useToggleProductoEstado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, estado }) => toggleProductoEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
};

export const useRegistrarMovimiento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registrarMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["movimientosProductos"] });
    },
  });
};