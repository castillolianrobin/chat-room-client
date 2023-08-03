import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import Pusher, { type Options } from 'pusher-js';
import type { ChannelAuthorizationData } from 'pusher-js/types/src/core/auth/options';
import { PusherMock } from 'pusher-js-mock';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const clientKey = 'dfc0eac3ee29b5ec1abb';
const config: Options = {
  cluster: 'ap1',
  forceTLS: true,
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
            },
            withCredentials: true,
          });
          callback(null, authData.data as ChannelAuthorizationData);
      } catch (e) {
          callback(e as Error, null);
      }
    },
  }),
};


let pusher = new Pusher(clientKey, config);
// @ts-ignore (Cypress Test Mock)
if (window.Cypress) {
  /** Mock pusher for e2e test */
  pusher = new PusherMock() as any;
// @ts-ignore (Cypress Test Mock)
  window.Cypress.pusher = pusher;
}
export default pusher;
