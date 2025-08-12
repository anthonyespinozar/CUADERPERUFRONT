import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAllProducciones, 
  registrarProduccion, 
  editarProduccion, 
  eliminarProduccion,
  iniciarProduccion,
  finalizarProduccion 
} from "@/services/produccionesService";

export const useProducciones = () => {
  const { isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["producciones"],
    queryFn: getAllProducciones,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};

// Hook para registrar producción con invalidación automática
export const useRegistrarProduccion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ordenId, produccionData }) => registrarProduccion(ordenId, produccionData),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["producciones"] });
      queryClient.invalidateQueries({ queryKey: ["ordenes-produccion"] });
    },
  });
};

// Hook para editar producción
export const useEditarProduccion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ produccionId, produccionData }) => editarProduccion(produccionId, produccionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["producciones"] });
      queryClient.invalidateQueries({ queryKey: ["ordenes-produccion"] });
    },
  });
};

// Hook para eliminar producción
export const useEliminarProduccion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (produccionId) => eliminarProduccion(produccionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["producciones"] });
      queryClient.invalidateQueries({ queryKey: ["ordenes-produccion"] });
    },
  });
};

// Hook para iniciar producción
export const useIniciarProduccion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ordenId) => iniciarProduccion(ordenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-produccion"] });
    },
  });
};

// Hook para finalizar producción
export const useFinalizarProduccion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ordenId) => finalizarProduccion(ordenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordenes-produccion"] });
      queryClient.invalidateQueries({ queryKey: ["producciones"] });
    },
  });
};
