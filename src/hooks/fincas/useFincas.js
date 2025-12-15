import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";

export function useFincas() {
  return useQuery({
    queryKey: ["fincas"],
    queryFn: async () => {
      const response = await axiosInstance.get("/fincas");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useFinca(fincaId) {
  return useQuery({
    queryKey: ["fincas", fincaId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/fincas/${fincaId}`);
      return response.data;
    },
    enabled: !!fincaId,
  });
}
