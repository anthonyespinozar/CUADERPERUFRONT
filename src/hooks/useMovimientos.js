import { useQuery } from "@tanstack/react-query";
import { getAllMovimientos } from "@/services/movimientosService";
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