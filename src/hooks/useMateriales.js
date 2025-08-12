import { useQuery } from "@tanstack/react-query";
import { getAllMateriales } from "@/services/materialesService";

export const useMateriales = () => {
  const {isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["materiales"],
    queryFn: getAllMateriales,
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};