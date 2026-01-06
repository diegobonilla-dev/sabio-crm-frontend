import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";

/**
 * Hook para obtener todos los departamentos de Colombia
 * @returns {Object} Query object con data (array de departamentos), isLoading, error
 */
export function useDepartamentos() {
  return useQuery({
    queryKey: ["departamentos"],
    queryFn: async () => {
      const response = await axiosInstance.get("/ubicaciones/departamentos");
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (datos estáticos)
  });
}

/**
 * Hook para obtener municipios de un departamento específico
 * @param {string} departamento - Nombre del departamento
 * @returns {Object} Query object con data (objeto con departamento y municipios), isLoading, error
 */
export function useMunicipios(departamento) {
  return useQuery({
    queryKey: ["municipios", departamento],
    queryFn: async () => {
      if (!departamento) return null;
      const response = await axiosInstance.get(
        `/ubicaciones/municipios/${departamento}`
      );
      return response.data;
    },
    enabled: !!departamento, // Solo ejecutar si hay departamento seleccionado
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (datos estáticos)
  });
}
