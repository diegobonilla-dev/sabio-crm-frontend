import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";
import { useToast } from "@/hooks/use-toast";

export function useFincaMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createFinca = useMutation({
    mutationFn: async ({ empresaId, ...fincaData }) => {
      const response = await axiosInstance.post(`/fincas/${empresaId}`, fincaData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fincas"] });
      toast({
        title: "Finca creada",
        description: "La finca se creó exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al crear finca",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  const updateFinca = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await axiosInstance.put(`/fincas/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fincas"] });
      toast({
        title: "Finca actualizada",
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

  const deleteFinca = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/fincas/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fincas"] });
      toast({
        title: "Finca eliminada",
        description: "La finca se eliminó exitosamente"
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

  const asociarCorporativo = useMutation({
    mutationFn: async ({ fincaId, corporativoId }) => {
      const response = await axiosInstance.post(`/fincas/${fincaId}/corporativos/${corporativoId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fincas"] });
      toast({
        title: "Corporativo asociado",
        description: "El corporativo se asoció exitosamente a la finca"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al asociar corporativo",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  return {
    createFinca,
    updateFinca,
    deleteFinca,
    asociarCorporativo
  };
}
