import {create} from "zustand";

const useActividadStatus = create((set) => ({
  valor: 1, // Valor inicial
  setValor: (nuevoValor) => set({ valor: nuevoValor }), 
}));

export default useActividadStatus;

