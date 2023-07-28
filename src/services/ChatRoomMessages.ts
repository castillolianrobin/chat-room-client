import axios from '@/plugins/axios';
import { CRUDService, type SuccessResponse, type TableResponse } from './types';
import type { User } from './Users';
class ChatRoomMessages extends CRUDService<ChatRoomMessage, CreateMessage>{
  roomId = 0;
  constructor(_roomId: number) {
    super(`chat/rooms/${_roomId}/messages`);
    this.roomId = _roomId;
  } 

  
  list2(params?: any) {
    return axios.get<SuccessResponse<ChatRoomMessage[]>>(`/${this.base}`, { params });
  }
}

export default ChatRoomMessages

export interface ChatRoomMessage {
  id: number;
  message: string;
  sender_id?: number;
  user?: User;
  room_id?: number;
  create_at: string;
  updated_at: string;
}

export interface CreateMessage {
  message: string;
}