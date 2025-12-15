import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";

export function useCorporativos() {
  return useQuery({
    queryKey: ["corporativos"],
    queryFn: async () => {
      const response = await axiosInstance.get("/corporativos");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCorporativo(corporativoId) {
  return useQuery({
    queryKey: ["corporativos", corporativoId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/corporativos/${corporativoId}`);
      return response.data;
    },
    enabled: !!corporativoId,
  });
}
