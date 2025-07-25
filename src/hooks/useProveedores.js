import { useQuery } from "@tanstack/react-query";
import { getAllProveedores } from "@/services/proveedoresService";
export const useProveedores = () => {
  const {isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["proveedores"],
    queryFn: getAllProveedores,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};