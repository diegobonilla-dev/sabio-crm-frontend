import { create } from 'zustand';

const useLeadFilterStore = create((set) => ({
  searchQuery: '',
  etapaFilter: 'Todos',
  origenFilter: 'Todos',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setEtapaFilter: (etapa) => set({ etapaFilter: etapa }),
  setOrigenFilter: (origen) => set({ origenFilter: origen }),

  resetFilters: () => set({
    searchQuery: '',
    etapaFilter: 'Todos',
    origenFilter: 'Todos'
  })
}));

export default useLeadFilterStore;
