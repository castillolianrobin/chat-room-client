import { faker } from "@faker-js/faker";
import { interceptGet, interceptPost } from "../../helpers/axios.cy";
import { generateChatRoomMember } from "../../seeders/ChatRoomMember";
import { generateChatRoom } from "../../seeders/ChatRooms";
import { generateUser } from "../../seeders/Users";
import { pusherMock } from "../../auth/helpers/pusher.cy";
import { generateChatRoomMessage } from "../../seeders/ChatRoomMessages";

/** __Seeders__ */

export const sampleChatRooms = [...new Array(5)].map((_,i)=>({
  ...generateChatRoom(i, '', (i > 2)),
}));

export const sampleUsers = [...new Array(40)].map((_, i)=>({
  ...generateUser(i),
}));

export const sampleMembers = [...new Array(40)].map((_, i)=>({
  ...generateChatRoomMember(
      i, 
      faker.number.int(sampleUsers.length),
      faker.number.int(sampleChatRooms.length),
      !!faker.number.int(2),
    ),
}));


export const sampleChatRoomsVerbose = [...sampleChatRooms].map(room=>({
  ...room,
  members: sampleMembers
    .filter((mem)=>mem.chat_room_id === room.id)
    .map((mem)=>{
      const user = sampleUsers
        .filter(user=>user.id === mem.user_id)
        .shift();
      return {
        chat_room_members: mem,
        ...user,
      };
    }),
}));

/** __Seeders-END__ */



/** __Interceptors__ */


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
    data: sampleChatRooms,
  }
};

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

// View Chat Room

export function interceptChatRoom(id: number) {
  // response body
  const body =  {
    success: {
      ...viewChatRoomResponse.success(id),
    },
  };
  
  return interceptGet('/chat/rooms/' + id, body);
}

export const viewChatRoomResponse = {
  success: (id: number) => {
    
    // Success Response
    return {
      message: "Operation completed successfully",
      data: {
        ...sampleChatRoomsVerbose
          .filter(room=>room.id===id)
          .shift(),
      }
    };
  },
  error: {

  },
}

// Edit Chat Room
export function interceptChatRoomEdit(id: number) {
  // response body
  const body =  {
    success: {
      ...editChatRoomResponse.success(id),
    },
  };
  
  return interceptPost('/chat/rooms/' + id, (req)=>{
    if (req.body._method === 'PUT') {
      body.success.data = {
        ...body.success.data,
        ...req.body,
      };
      req.reply(200, body);
    } else {
      req.reply(404);
    }
  });
}

export const editChatRoomResponse = {
  success: (id: number) => {
    
    // Success Response
    return {
      message: "Room updated successfully",
      data: {
        ...sampleChatRoomsVerbose
          .filter(room=>room.id===id)
          .shift(),
      }
    };
  },
  error: {

  },
}

// Delete Chat Room
export function interceptChatRoomDelete(id: number) {
  // response body
  const body =  {
    success: {
      ...deleteChatRoomResponse.success(id),
    },
  };
  
  return interceptPost('/chat/rooms/' + id, (req)=>{
    if (req.body._method === 'DELETE') {
      body.success.data = {
        ...body.success.data,
        ...req.body,
      };
      req.reply(200, body);
    } else {
      req.reply(404);
    }
  });
}

export const deleteChatRoomResponse = {
  success: (id: number) => {
    
    // Success Response
    return {
      message: "Room deleted successfully.",
      data: {
        ...sampleChatRooms
          .filter(room=>room.id===id)
          .shift(),
      }
    };
  },
  error: {

  },
}



// Leave Chat Room
export function interceptChatRoomLeave(id: number) {
  // response body
  const body =  {
    success: {
      ...leaveChatRoomResponse.success(id),
    },
  };
  
  return interceptPost(`/chat/rooms/${id}/members/leave`, (req)=>{
    body.success.data = {
      ...body.success.data,
      ...req.body,
    };
    req.reply(200, body);
  });
}

export const leaveChatRoomResponse = {
  success: (id: number) => {
    
    // Success Response
    return {
      message: "Member is no longer available to chat.",
      data: {
        ...sampleChatRooms
          .filter(room=>room.id===id)
          .shift(),
      }
    };
  },
  error: {

  },
}



// Add Member
export function interceptChatRoomMemberAdd(room_id: number) {
  return interceptPost(`/chat/rooms/${room_id}/members/`, (req)=> {
    const email = req.body.email;
    const is_admin = req.body.is_admin;
    const user = sampleUsers.filter(usr=>usr.email === email).shift();

    req.reply(200, {
      user_id: user?.id,
      chat_room_id: room_id,
      is_admin,
    });
  });
}


// Fetch messages
export function interceptChatRoomMessages(room_id: number) {
  const roomMembers = sampleMembers
    .filter(mem=>mem.chat_room_id === room_id)
    .map(mem=>(sampleUsers
      .filter(usr=>usr.id === mem.user_id))
      .shift()
    )

    const messages = [...new Array(20)].map((_, i)=>({
      ...generateChatRoomMessage(
        i,
        faker.helpers.arrayElement(roomMembers),
        room_id,
      ),
    }))
  // generateChatRoomMessage
  
  return interceptGet(`/chat/rooms/${room_id}/messages`, (req) => {
    
    // Send a message created pusher event
    // pusherMock()
    //   .channels[`presence-room.${room_id}`]
    //   .emit('MessageCreated', {
    //     roomId: room_id,
    //     message: body,
    //   });
    
    req.reply(201 , {
      success: {
        message: 'Message delivered',
        data: messages,
      }
    });
  });
}

// Send Message
export function interceptChatRoomMessageSend(room_id: number, sender_id: number) {
  return interceptPost(`/chat/rooms/${room_id}/messages/`, (req) => {
    const body = {
      id: 5,
      room_id,
      sender_id,
      message: req.body.message,
      updated_at: faker.date.recent().toISOString(),
      created_at: faker.date.recent().toISOString(),
    };
    
    // Send a message created pusher event
    pusherMock()
      .channels[`presence-room.${room_id}`]
      .emit('MessageCreated', {
        roomId: room_id,
        message: body,
      });
    onMessageCreated(room_id, body);
    req.reply(201 , {
      success: {
        message: 'Message delivered',
        data: body,
      }
    });
  });
}

/** __PUSHER EVENT__ */

export function onMessageCreated (room_id: number, body: { id: number, room_id: number, sender_id: number, message: string, created_at: string, updated_at: string }) {
  
  // Send a message created pusher event
  pusherMock()
    .channels[`presence-room.${room_id}`]
    .emit('MessageCreated', {
      roomId: room_id,
      message: body,
    });
} 


/** __TYPE DEFINITION__ */

export interface CreateChatRoom {
  name: string;
  is_private: boolean;  
}
