import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";
import { useToast } from "@/hooks/use-toast";

export function useLeadMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createLead = useMutation({
    mutationFn: async (leadData) => {
      const response = await axiosInstance.post("/leads", leadData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Lead creado",
        description: "El lead se creó exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al crear lead",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  const updateLead = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/leads/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Lead actualizado",
        description: "Los cambios se guardaron exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  const deleteLead = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/leads/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({
        title: "Lead eliminado",
        description: "El lead se eliminó exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  const convertirLead = useMutation({
    mutationFn: async ({ leadId, password, nit, razon_social }) => {
      const response = await axiosInstance.post(`/leads/${leadId}/convertir`, {
        password,
        nit,
        razon_social
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
      toast({
        title: "Lead convertido",
        description: "El lead se convirtió a empresa exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al convertir",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  return {
    createLead,
    updateLead,
    deleteLead,
    convertirLead
  };
}
