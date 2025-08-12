import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/services/dashboardService";

export const useDashboard = () => {
  const {
    isLoading,
    data,
    isError,
    isFetching,
    refetch,
    error
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
    refetchInterval: 300000, // Refetch cada 5 minutos
    staleTime: 300000, // Los datos se consideran frescos por 5 minutos
  });

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    error,
  };
};