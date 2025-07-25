import { useQuery } from "@tanstack/react-query";
import { getAllCompras } from "@/services/comprasService";

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