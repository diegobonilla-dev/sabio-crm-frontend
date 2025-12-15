import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const response = await axiosInstance.get("/leads");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLead(leadId) {
  return useQuery({
    queryKey: ["leads", leadId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/leads/${leadId}`);
      return response.data;
    },
    enabled: !!leadId,
  });
}
