// axios
import axios from '@/plugins/axios';
import type { UserDetail } from './UserDetails';
import type { SuccessResponse } from './types';

class Settings {
  base = 'settings';
  
  updateProfile(profileForm: ProfileForm) {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const data = {
        ...profileForm,
        _method: 'PUT',
    };
    return axios.post<SuccessResponse<UserDetail>>(`${this.base}/profile`, data, { headers });
  }
}

export default new Settings();



/** __TYPE DEFINITION__ */

export interface ProfileForm {
  first_name: string;
  last_name: string;
  middle_name?: string;
  profile_img?: null | File;
}