import { interceptGet, interceptPost } from "../../helpers/axios.cy";

/** Chat room interceptor */

// Chat Room Lists

export function interceptChatRooms() {
  interceptGet('/chat/rooms', {
    statusCode: 200,
    body: chatRoomsSuccess,
  });
}

export const chatRoomsSuccess = {
  success: {
    message: 'Operation completed successfully',
    data: [
      { id: 1, name: 'Chat room sample', is_private: 1, members_count: 2, updated_at: '2023-07-28T08:57:24.000000Z', created_at: '2023-07-28T08:57:24.000000Z', }, 
      { id: 2, name: 'Chat room sample 2', is_private: 1, members_count: 4, updated_at: '2023-07-28T08:57:24.000000Z', created_at: '2023-07-28T08:57:24.000000Z', }, 
      { id: 3, name: 'Public room sample', is_private: 0, members_count: 4, updated_at: '2023-07-28T08:57:24.000000Z', created_at: '2023-07-28T08:57:24.000000Z', }, 
      { id: 4, name: 'Public room sample 2', is_private: 0, members_count: 2, updated_at: '2023-07-28T08:57:24.000000Z', created_at: '2023-07-28T08:57:24.000000Z', }, 
    ],
  }
}

// Create Chat Room

export function interceptChatRoomCreate() { 
  return interceptPost('/chat/rooms/', (req)=>{
    const form = req.body as CreateChatRoom;
    const body =  { ...createChatRoomSuccessResponse };
    body.success.data.is_private = form.is_private;
    body.success.data.name = form.name;
    
    req.reply(201, body);
  });
}

export const createChatRoomSuccessResponse = {
  success: { 
    data: {
      created_at: "2023-08-01T10:59:32.000000Z",
      updated_at: "2023-08-01T10:59:32.000000Z",
      id: 5,
      is_private: true,
      name: 'New Room',
    },
    message: "New room created!",
  },
}


/** __TYPE DEFINITION__ */

export interface CreateChatRoom {
  name: string;
  is_private: boolean;  
}