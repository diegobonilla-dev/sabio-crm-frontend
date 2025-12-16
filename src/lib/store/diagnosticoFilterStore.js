import { create } from "zustand";

const useDiagnosticoFilterStore = create((set) => ({
  searchQuery: "",
  tipoFilter: "Todos",
  estadoFilter: "Todos",
  fincaFilter: "Todos",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setTipoFilter: (tipo) => set({ tipoFilter: tipo }),
  setEstadoFilter: (estado) => set({ estadoFilter: estado }),
  setFincaFilter: (finca) => set({ fincaFilter: finca }),

  resetFilters: () =>
    set({
      searchQuery: "",
      tipoFilter: "Todos",
      estadoFilter: "Todos",
      fincaFilter: "Todos",
    }),
}));

export default useDiagnosticoFilterStore;
