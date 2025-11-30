"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook: Mutations de usuarios (create, update, delete, changePassword)
 */
export function useUserMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // CREATE
  const createUser = useMutation({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post("/users", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Usuario creado",
        description: "El usuario se creó exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al crear usuario",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  // UPDATE
  const updateUser = useMutation({
    mutationFn: async ({ userId, data }) => {
      const response = await axiosInstance.put(`/users/${userId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Usuario actualizado",
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

  // CHANGE PASSWORD
  const changePassword = useMutation({
    mutationFn: async ({ userId, newPassword }) => {
      const response = await axiosInstance.put(
        `/users/${userId}/password`,
        { newPassword }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "La contraseña se cambió exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error al cambiar contraseña",
        description: error.response?.data?.message || "Intenta nuevamente"
      });
    }
  });

  // DELETE
  const deleteUser = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Usuario eliminado",
        description: "El usuario se eliminó exitosamente"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "No se puede eliminar",
        description: error.response?.data?.message || "El usuario tiene dependencias"
      });
    }
  });

  return {
    createUser,
    updateUser,
    changePassword,
    deleteUser
  };
}
