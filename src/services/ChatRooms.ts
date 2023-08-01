import axios from '@/plugins/axios';
import { CRUDService, type SuccessResponse, type TableResponse } from './types';
import type { User } from './Users';
import type { ChatRoomMember } from './ChatRoomMembers';

class ChatRooms extends CRUDService<ChatRoom, CreateChatRoom>{
  
  constructor() {
    super('chat/rooms');
  } 

  
  list2(params?: any) {
    return axios.get<SuccessResponse<ChatRoom[]>>(`/${this.base}`, { params });
  }
}

export default new ChatRooms()

export interface ChatRoom {
  id: number;
  name: string;
  is_private: 0 | 1;
  create_at: string;
  updated_at: string;
  members?: ChatRoomUser[];
  members_count?: number;
}

export interface ChatRoomUser extends User {
  chat_room_members?: ChatRoomMember
}
export interface CreateChatRoom {
  name: string;
  is_private: boolean;  
}