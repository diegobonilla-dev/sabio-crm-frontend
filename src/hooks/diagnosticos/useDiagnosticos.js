import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";

export function useDiagnosticos() {
  return useQuery({
    queryKey: ["diagnosticos"],
    queryFn: async () => {
      const response = await axiosInstance.get("/diagnosticos");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDiagnostico(diagnosticoId) {
  return useQuery({
    queryKey: ["diagnosticos", diagnosticoId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/diagnosticos/${diagnosticoId}`);
      return response.data;
    },
    enabled: !!diagnosticoId,
  });
}
