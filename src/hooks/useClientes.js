import { useQuery } from "@tanstack/react-query";
import { getAllClientes } from "@/services/clientesService";

export const useClientes = () => {
  const {isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["clientes"],
    queryFn: getAllClientes,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};