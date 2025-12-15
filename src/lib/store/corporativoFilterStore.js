import { create } from 'zustand';

const useCorporativoFilterStore = create((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set({ searchQuery: '' }),
}));

export default useCorporativoFilterStore;
