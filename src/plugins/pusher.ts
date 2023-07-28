import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import Pusher from 'pusher-js';
import type { ChannelAuthorizationData } from 'pusher-js/types/src/core/auth/options';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const pusher = new Pusher('dfc0eac3ee29b5ec1abb', {
  cluster: 'ap1',
  
  /** Handles authorization for private channel */
  authorizer: (channel, _options) => ({
    authorize: async (socketID, callback) => {
      try {
          const { user } = useAuthStore(); 
          const authData = await axios.post(baseURL + '/broadcasting/auth', 
          {
            socket_id: socketID,
            channel_name: channel.name,
          }, 
          {
            headers: {
              "Authorization": user ? `Bearer ${user?.token}` : '', 
             "Access-Control-Allow-Origin": "*"
            }
          });
          callback(null, authData.data as ChannelAuthorizationData);
      } catch (e) {
          callback(e as Error, null);
      }
    },
  }),

  // authEndpoint: baseURL + '/broadcasting/auth',
  // auth: {
  //   headers: {
  //     "Authorization": useAuthStore().user ? `Bearer ${useAuthStore().user?.token}` : '',
  //     "Access-Control-Allow-Origin": "*"
  //   },
  // },
});
export default pusher;