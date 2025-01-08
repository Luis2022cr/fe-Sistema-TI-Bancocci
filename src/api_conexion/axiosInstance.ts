import axios from 'axios';
import { makeUseAxios } from "axios-hooks";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useAxios = makeUseAxios({
  axios: axiosInstance,
});

export default axiosInstance;
