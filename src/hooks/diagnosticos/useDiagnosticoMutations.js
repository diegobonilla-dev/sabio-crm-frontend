import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";
import { useToast } from "@/hooks/use-toast";

export function useDiagnosticoMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createDiagnostico = useMutation({
    mutationFn: async (diagnosticoData) => {
      const response = await axiosInstance.post("/diagnosticos", diagnosticoData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosticos"] });
      toast({
        title: "Diagnóstico creado",
        description: "El diagnóstico se creó exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al crear diagnóstico",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  const updateDiagnostico = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/diagnosticos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosticos"] });
      toast({
        title: "Diagnóstico actualizado",
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

  const deleteDiagnostico = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/diagnosticos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosticos"] });
      toast({
        title: "Diagnóstico eliminado",
        description: "El diagnóstico se eliminó exitosamente"
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
    createDiagnostico,
    updateDiagnostico,
    deleteDiagnostico
  };
}
