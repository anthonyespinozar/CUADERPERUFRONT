import { useQuery } from "@tanstack/react-query";
import { getAllProducciones } from "@/services/produccionesService";

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
