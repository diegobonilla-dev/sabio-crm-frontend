import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";
import { useToast } from "@/hooks/use-toast";

export function useCorporativoMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createCorporativo = useMutation({
    mutationFn: async (corporativoData) => {
      const response = await axiosInstance.post("/corporativos", corporativoData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporativos"] });
      toast({
        title: "Corporativo creado",
        description: "El corporativo se creó exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al crear corporativo",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  const updateCorporativo = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/corporativos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporativos"] });
      toast({
        title: "Corporativo actualizado",
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

  const deleteCorporativo = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/corporativos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporativos"] });
      toast({
        title: "Corporativo eliminado",
        description: "El corporativo se eliminó exitosamente"
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

  return {
    createCorporativo,
    updateCorporativo,
    deleteCorporativo
  };
}
