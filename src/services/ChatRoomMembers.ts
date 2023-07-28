import axios from '@/plugins/axios';
import { CRUDService, type SuccessResponse, type TableResponse } from './types';
import type { User } from './Users';
import type { ChatRoom } from './ChatRooms';
class ChatRoomMembers extends CRUDService<ChatRoomMember, CreateRoomMember>{
  roomId = 0;
  constructor(_roomId: number) {
    super(`chat/rooms/${_roomId}/members`);
    this.roomId = _roomId;
  } 

  
  list2(params?: any) {
    return axios.get<SuccessResponse<ChatRoomMember[]>>(`/${this.base}`, { params });
  }
}

export default ChatRoomMembers

export interface ChatRoomMember {
  id: number;
  user_id?: number;
  user?: User;
  chat_room_id?: number;
  chat_room?: ChatRoom;
  is_admin?: 1 | 0;
  create_at: string;
  updated_at: string;
}

export interface CreateRoomMember {
  email: string;
  is_admin?: 1 | 0 | boolean;
}