import axios from 'axios';

const axiosClient = (() => {
  function api() {
    let token = localStorage.getItem("token");
    if (token == null) {
      return axios.create({
        baseURL: import.meta.env.VITE_API_URL,
      });
    } else {
      return axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    }
  }

  return { api };
})();

export default axiosClient;
