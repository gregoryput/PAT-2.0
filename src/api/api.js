import axiosClient from "@/config/axios";
 
export const fetcher = (url) => axiosClient.api().get(url).then((res) => res.data);

export const URL = '/Account/pruebaBuena';
