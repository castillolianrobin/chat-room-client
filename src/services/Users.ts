import axios from '@/plugins/axios';
import { CRUDService, type SuccessResponse, type TableResponse } from './types';

class Users extends CRUDService<User, CreateUser>{
  constructor() {
    super('user')
  }

  // Auth
  login(params?: any) {
    return axios.post<SuccessResponse<{user:User; token: string}>>(`/login`, params);
  }
  logout(params?: any) {
    return axios.post<SuccessResponse<User>>(`/logout`, params);
  }
  register(user: CreateUser) {
    return axios.post<SuccessResponse<User>>(`/register`, user);    
  }
  verifyAccount(params: { email: string, token: string }) {
    return axios.post('/verify-account', params);
  }
}

export default new Users();


/** __TYPE DEFINITION__ */

export interface User {
  email: string;
  password?: string;
  id: number;
  token?: string; 
  // tokenExpiration?: string;
  first_name?: string;
  last_name?: string;
  updated_at: string;
  created_at: string;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthday?: string;
}
export interface CreateUser extends Modify<User,{
  id?: number;
  password: string, 
  password_confirmation: string, 
  updated_at?: string;
  created_at?: string;
}> {}

type Modify<T, R> = Omit<T, keyof R> & R;