import axios from 'axios'

import router from '@/router'
import { authManager } from '@/utils/auth-manager'

const api = axios.create({
  baseURL: (import.meta.env.VITE_BASE_URL),
})

api.interceptors.request.use(config => {
  const token = authManager.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 ||
      error.code === 'ECONNABORTED' ||
      !error.response ||
      error.message.includes('Network Error'))
    ) {
     authManager.clear();
      // Redirect to /login
      router.push('/login');
    }
    else if (!error.response) {
      router.push('/login')
    }
    return Promise.reject(error);
  },
);


export default api
