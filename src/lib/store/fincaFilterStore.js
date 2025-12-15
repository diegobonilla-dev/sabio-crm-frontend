import { create } from 'zustand';

const useFincaFilterStore = create((set) => ({
  searchQuery: '',
  tipoFilter: 'Todos',
  empresaFilter: 'Todos',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setTipoFilter: (tipo) => set({ tipoFilter: tipo }),
  setEmpresaFilter: (empresa) => set({ empresaFilter: empresa }),

  resetFilters: () => set({
    searchQuery: '',
    tipoFilter: 'Todos',
    empresaFilter: 'Todos'
  })
}));

export default useFincaFilterStore;
