import create from 'zustand';

const useSearch = create((set) => ({
    ubicacion: {
      region: "SCA&C",
      year: "2024",
      pais: "Republica Dominicana",
      paisID: 1,
    },
    setUbicacion: (nuevaUbicacion) => set({ ubicacion: nuevaUbicacion }),
  }));
export default useSearch;
