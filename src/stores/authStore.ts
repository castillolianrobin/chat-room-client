import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserLogin } from '@/services/Users';

export const useAuthStore = defineStore('user', () => { 
  const user = ref<UserLogin | null>(getRememberedUser());
  // const token = computed(() => user.value?.token)
  
  function setUser(_user: UserLogin | null) {
    user.value = _user;
    localStorage.setItem(storageUserKey, JSON.stringify(_user));
  }
  

  return { user, setUser }
})


export const storageUserKey = '_auth_user';



/** HELPERS */

function getRememberedUser() {
  const rememberedUserString: string = localStorage.getItem(storageUserKey) || '';
  let rememberedUser = undefined;
  if (rememberedUserString && typeof rememberedUserString === 'string') {
    try {
      rememberedUser = JSON.parse(rememberedUserString);
    } catch (e) {
      console.error('auth: ',e)
      rememberedUser = undefined;
    }
  }
  return rememberedUser;
}