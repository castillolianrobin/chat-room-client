// axios
import axios from '@/plugins/axios';
// pusher
import type { Channel } from "pusher-js";
import pusher from "@/plugins/pusher";
import type { User } from "./Users";


/** __AXIOS TYPES AND CLASSES__ */

/** [Class] CRUD API default */
export class CRUDService<Model = {}, CreateParams = Model> {
  base = '';

  constructor(base = '') {
    this.base = base;
  }
  
  list(params?: any) {
    return axios.get<SuccessResponse<TableResponse<Model>>>(`/${this.base}`, { params });
  }
  
  show(id: number) {
    return axios.get<SuccessResponse<Model>>(`/${this.base}/${id}`);
  }
  
  create(data: CreateParams) {
    return axios.post<SuccessResponse<Model>>(`/${this.base}/`, data);
  }

  
  update(id:number, data: CreateParams) {
    return axios.post<SuccessResponse<Model>>(`/${this.base}/${id}`, { ...data, _method: 'PUT' });
  }

  delete(id: number) {
    return axios.post<SuccessResponse>(`/${this.base}/${id}`, { _method: 'DELETE' });
  }
}

/** [Type] Axios success response */
export interface SuccessResponse<Data = {}> {
  message: string; 
  data: Data;
}

/** [Type] Axios error response */
export interface ErrorResponse<Data = {}, Errors = {}> {
  message?: string;
  errors?: Errors;
  data?: Data;
}

/** [Type] Axios success response for paginated data */
export interface TableResponse<Data = {}> {
  data: Data[];
  to: number; 
  from: number; 
  total: number; 
  perPage: number; 
  lastPage: number; 
  currentPage: number;
}



/** __PUSHER TYPES AND CLASSES__ */


/** [Class] default channel */
export class PusherChannel {
  channelName = '';
  channel: Channel | null = null;
  
  constructor(name: string) {
    this.channelName = name;
    this.subscribe();
  }

  subscribe() {
    return this.channel = pusher.subscribe(this.channelName,);
  }

  unsubscribe() {
    this.channel?.unsubscribe();
  }

  onSubscribe(callback: (...params: any)=>void) {
    this.channel?.bind('pusher:subscription_succeeded', callback);
  }
}

/** [Class] Laravel private channel */
export class PrivateChannel extends PusherChannel {
  constructor(name: string) {
    super(`private-${name}`);
  }
}

/** [Class] Laravel presence channel */
export class PresenceChannel extends PusherChannel {
  constructor(name: string) {
    super(`presence-${name}`);
  }

  /** 
   * event handler when subscription succeeds 
   */
  onSubscribe(callback: (params: { count: number, members: {[s: string | number]: User}, me: User, myID: string })=>void) {
    this.channel?.bind('pusher:subscription_succeeded', callback);
  }
  
  /** 
   * event handler when new member joins the chat room 
   */
  onMemberAdded(callback: (param: { id: string, info: User })=> void) {
    this.channel?.bind("pusher:member_added", callback)
  }

  /** 
   * event handler when new member joins the chat room 
   */
  onMemberRemoved(callback: (param: { id: string, info: User })=> void) {
    this.channel?.bind("pusher:member_removed", callback)
  }
}