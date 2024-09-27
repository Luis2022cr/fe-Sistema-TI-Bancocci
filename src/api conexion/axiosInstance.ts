import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_URL_BACK,
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

export default axiosInstance;