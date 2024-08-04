import axiosClient from "@/config/axios";


// Define la función para realizar la petición de login
export const getLogin = async (data) => {
  const response = await axiosClient.api().post("/Account/login", data);
  return response.data;
};

