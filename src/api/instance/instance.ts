import axios from 'axios';
import { showErrorAlert } from '../../alerts/error/error-alert';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Los archivos estáticos (imágenes de producto) se sirven en la raíz del host,
// no bajo /api como el resto de la API.
export const STATIC_BASE_URL = API_URL.replace(/\/api\/?$/, '');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/') {
        showErrorAlert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
