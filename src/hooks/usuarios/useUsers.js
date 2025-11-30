"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/lib/axios";

/**
 * Hook: Obtener lista de usuarios
 */
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      return response.data; // Array de usuarios
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook: Obtener un usuario por ID
 */
export function useUser(userId) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId, // Solo ejecutar si hay userId
  });
}

/**
 * Hook: Verificar dependencias de un usuario
 */
export function useUserDependencies(userId) {
  return useQuery({
    queryKey: ["users", userId, "dependencies"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/${userId}/dependencies`);
      return response.data; // { canDelete, dependencies }
    },
    enabled: !!userId,
  });
}
