import {create} from "zustand";

const useActiveSearch = create((set) => ({
  activo: false,
  toggleActivo: () => set((state) => ({ activo: !state.activo })),
  toggleActivoForFalse: () => set({ activo: true }),
}));

export default useActiveSearch;

