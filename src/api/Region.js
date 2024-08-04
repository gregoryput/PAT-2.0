import axiosClient from "@/config/axios";

// Define la función para realizar la petición de login
export const getRegion = async () => {
    const response = await axiosClient.api().post("/Region");
    return response.data;
  };
  
  