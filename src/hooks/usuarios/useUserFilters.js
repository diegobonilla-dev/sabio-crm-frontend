"use client";

import { create } from "zustand";

/**
 * Store: Manejo de filtros, búsqueda y paginación
 */
const useUserFilters = create((set) => ({
  // Estado
  searchQuery: "",
  roleFilter: "all",
  currentPage: 1,
  pageSize: 10,

  // Acciones
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setRoleFilter: (role) => set({ roleFilter: role, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
  resetFilters: () => set({
    searchQuery: "",
    roleFilter: "all",
    currentPage: 1
  })
}));

export default useUserFilters;
