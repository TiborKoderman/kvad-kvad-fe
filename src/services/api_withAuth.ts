import axios from 'axios';

import { useRouter } from 'vue-router';

const router = useRouter();

const api = axios.create({
  baseURL: 'http://localhost:5033',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('401 error');

      localStorage.removeItem('token');
      // Redirect to /login
      router.push('/login');
    }
    return Promise.reject(error);
  },
);

export default api;
