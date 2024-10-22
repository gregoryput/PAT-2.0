import {create} from "zustand";

const useSelectedActividad = create((set) => ({
  actividad: {}, // Valor inicial
  setActividad: (nuevo) => set({ actividad: nuevo }), 
}));

export default useSelectedActividad;

