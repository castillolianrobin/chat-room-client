import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import axios, { AxiosError } from 'axios';
// Helpers 
import formHelper from '@/helpers/formHelper';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
console.log('ENV IN REAL',import.meta.env.VITE_API_URL);


// Request Interceptor for Beater Token Auth
axios.interceptors.request.use(
  (config)=> {
    const { user } = useAuthStore();
    if (user && user?.token && !config.headers?.Authorization) {
      config
        .headers
        .setAuthorization(`Bearer ${user.token}`);
    }

    if (config.headers['Content-Type'] === 'multipart/form-data') {
      config.data = formHelper.generateFormData(config.data);
    }
    return config;
});

axios.interceptors.response.use(response=>response, (error: AxiosError)=>{
  const authStore = useAuthStore();
  if (error.response?.status === 401) {
    authStore.setUser(null);
    router.push({ name: 'Login' });
    console.error('Error: Token Expired / Missing')
  } else {
    console.error(error)
  }
  return Promise.reject(error);
});

export default axios;