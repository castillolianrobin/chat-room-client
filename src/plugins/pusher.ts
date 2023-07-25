import { useAuthStore } from '@/stores/authStore';
import Pusher from 'pusher-js';

const { user } = useAuthStore();
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const pusher = new Pusher('dfc0eac3ee29b5ec1abb', {
  cluster: 'ap1',
  authEndpoint: baseURL + '/broadcasting/auth',
  auth: {
    headers: {
      "Authorization": user ? `Bearer ${user.token}` : '',
      "Access-Control-Allow-Origin": "*"
    },
  },
});
export default pusher;