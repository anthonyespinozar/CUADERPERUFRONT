import { useQuery } from "@tanstack/react-query";
import { getAllMateriales } from "@/services/materialesService";

export const useMateriales = () => {
  const {isLoading, data, isError, isFetching, refetch } = useQuery({
    queryKey: ["materiales"],
    queryFn: getAllMateriales,
  });

  // Log para debugging
  /*nsole.log('=== HOOK MATERIALES ===');
  console.log('Data:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', isError);
  console.log('Fetching:', isFetching);
  */

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
};