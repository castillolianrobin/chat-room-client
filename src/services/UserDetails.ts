import axios from '@/plugins/axios';
import { CRUDService } from './types';

class UserDetails extends CRUDService<UserDetail, CreateUserDetail>{
  constructor(userId: number) {
    super(`users/${userId}/details`);
  }
}

export default UserDetails;


/** __TYPE DEFINITION__ */

export interface UserDetail {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  profile_img_url?: string;
  updated_at: string;
  created_at: string;
}
export interface CreateUserDetail extends Modify<UserDetail,{
  id?: number;
  user_id?: number;
  updated_at?: string;
  created_at?: string;
}> {}

type Modify<T, R> = Omit<T, keyof R> & R;