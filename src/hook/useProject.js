import {create} from 'zustand';

const useProject = create((set) => ({
    project: {
      projectId: "",
      year: ""
    },
    setProject: (newProject) => set({ project: newProject }),
  }));
export default useProject;


