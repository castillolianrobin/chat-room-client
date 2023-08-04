import { faker } from "@faker-js/faker";
import { loginSuccessResponse } from "../auth/helpers/login.cy";
import { typeOnInput } from "../helpers/input.cy";
import type { generateChatRoomMessage } from "../seeders/ChatRoomMessages";
import { interceptChatRoom, interceptChatRoomDelete, interceptChatRoomEdit, interceptChatRoomLeave, interceptChatRoomMemberAdd, interceptChatRoomMessageSend, interceptChatRoomMessages, interceptChatRooms, onMessageCreated, sampleChatRooms, sampleChatRoomsVerbose, sampleMembers, sampleUsers } from "./helpers/chatroom.cy";

describe('Chat Room Page', () => {
  const roomEl = {
    name: '[aria-label="room name"]',
    members: '[aria-label="room member"]',
    edit: {
      btn: 'button[aria-label="edit room"]',
      roomName: 'input[aria-label="room name"]',
      submit: 'button[aria-label="edit room submit"]',
      cancel: 'button[aria-label="edit room cancel"]',  
    },
    delete: {
      btn: 'button[aria-label="delete room"]',
      roomName: 'input[aria-label="room name"]',
      submit: 'button[aria-label="delete room submit"]',
      cancel: 'button[aria-label="delete room cancel"]', 
    },
    leave: {
      btn: 'button[aria-label="leave room"]',
      submit: 'button[aria-label="leave room submit"]',
      cancel: 'button[aria-label="leave room cancel"]',
    },
    addMember: {
      btn: 'button[aria-label="add member"]',
      email: 'input[aria-label="email"]',
      is_admin: '[aria-label="Administrator Level"]',
      submit: 'button[aria-label="add member submit"]',
      cancel: 'button[aria-label="add member cancel"]', 
    },
    sendMessage: {
      message: 'input[aria-label="message"]',
      submit: 'button[aria-label="send"]',
    },
  };
  
  /** Helper Data */
  // Private room data
  
  const privateRoom = sampleChatRoomsVerbose
    .filter(room=>
        !!room.is_private 
        && room.members
          .filter(mem=>mem.chat_room_members.is_admin).length > 0
        && room.members
          .filter(mem=>!mem.chat_room_members.is_admin).length > 0 
    ).shift();
  
  const regularMember = privateRoom?.members
    .filter(mem=>mem.chat_room_members.is_admin == 0)
    .shift();
  const privateMember = sampleUsers
    .filter((usr)=>usr.id === regularMember?.id)
    .shift();
  
  const adminMember = privateRoom?.members
    .filter(mem=>!!mem.chat_room_members.is_admin)
    .shift();
  const privateAdmin = sampleUsers
    .filter((usr)=>usr.id === adminMember?.id)
    .shift();
  // const publicRoomId = sampleChatRooms.filter(room=>!room.is_private).shift();
  
  
  /** Helper Function */

  function visitPrivateRoom(memberType: 'member'|'admin' = 'member') {
    if (memberType === 'admin') {
      cy.wrap(privateAdmin).should('not.be.null');
      window.localStorage.setItem('_auth_user', JSON.stringify({ ...privateAdmin, token }));
    } else {
      cy.wrap(privateMember).should('not.be.null');
      window.localStorage.setItem('_auth_user', JSON.stringify({ ...privateMember, token }));
    }
    
    cy.visit('/chat/room/' + privateRoom?.id);
    if (privateRoom) {
      interceptChatRoomMessages(privateRoom?.id).as('messages');
      interceptChatRoom(privateRoom?.id).as('room');
      interceptChatRoomEdit(privateRoom?.id).as('editRoom');
    }
  }
  
  const { token, user } = loginSuccessResponse.success.data;
  beforeEach(() => {
    window.localStorage.setItem('_auth_user', JSON.stringify({ ...user, token }));
  });

  it ('loads room data correctly', () => {
    visitPrivateRoom();
    cy.wait('@room').then((interception)=>{
      const body = interception.response?.body;
      // Room Name is displayed
      cy.get(roomEl.name).contains(body.success.data.name);
    });

    cy.wait('@messages').then((interception)=>{
      // Messages are displayed
      const messages = interception.response?.body.success.data as ReturnType<typeof generateChatRoomMessage>[];
      
      for(const i in messages) {
        const message = messages[i];
        if (message.message) {
          cy.contains(message.message).should('exist');
        }
      }
    })
  });

  
  // View Members
  it ('loads members  correctly', () => {
    visitPrivateRoom();
    cy.wait('@room').then(()=> {
      cy.get(roomEl.members).should('exist');
    });
  })

  // Add Members
  it('(admin) add members  correctly', () => {
    // Hidden on members only
    visitPrivateRoom('member');
    cy.wait('@room')
    .then(()=> {
      cy.get(roomEl.addMember.btn).should('not.exist');
    })
    // Show if admin
    .then(()=>{
      visitPrivateRoom('admin');
      cy.wait('@room').then(()=> {
        // Add new member
        cy.get(roomEl.addMember.btn).click();
        const newMember = sampleMembers
          .filter(mem=>mem.chat_room_id !== privateRoom?.id)
          .map(mem=>({
            ...sampleUsers
              .filter(usr=>usr.id===mem.user_id)
              .shift(),
          }))
          .shift();
        typeOnInput(roomEl.addMember.email, newMember?.email);
        cy.get(roomEl.addMember.is_admin).click();
        privateRoom && interceptChatRoomMemberAdd(privateRoom?.id)
          .as('addMember');
        cy.get(roomEl.addMember.submit).click();
        cy.wait('@addMember').then((interception)=>{
          const body = interception.response?.body;
          cy.wrap(body.is_admin).should('eq', true);
          cy.wrap(body.user_id).should('eq', newMember?.id);
          cy.wrap(body.chat_room_id).should('eq', privateRoom?.id);
          cy.contains(`success`).should('exist');
          // cy.contains(`${newMember?.first_name} ${newMember?.last_name} `)
        })
      });
    });
  })


  // Edit
  it('(admin) edit room correctly', ()=>{
    visitPrivateRoom('admin');
    const newName = 'Test new name';
    // Cancel Edit Room
    cy.get(roomEl.edit.btn).click();
    typeOnInput(roomEl.edit.roomName, newName);
    cy.get(roomEl.edit.cancel).click();
    cy.get(roomEl.name).contains(privateRoom?.name ?? '');
    
    // Confirm Edit Room
    cy.get(roomEl.edit.btn).click();
    typeOnInput(roomEl.edit.roomName, newName, true);
    cy.get(roomEl.edit.submit).click();
    cy.wait('@editRoom').then(()=>{
      cy.get(roomEl.name).contains(newName);
    });
  })

  // Delete
  it('(admin) Delete room correctly', ()=>{
    visitPrivateRoom('admin');
    interceptChatRooms();
    privateRoom && interceptChatRoomDelete(privateRoom?.id)
    .as('deleteRoom');
    
    // open delete modal
    cy.get(roomEl.delete.btn).click();
    typeOnInput(roomEl.edit.roomName, privateRoom?.name);
    cy.get(roomEl.delete.submit).click();
    cy.wait('@deleteRoom').then(()=>{
      cy.url().should('not.contain', `rooms/${privateRoom?.id}`)
    });
  })

  // Leave
  it('leave room correctly', () => {
    visitPrivateRoom();
    interceptChatRooms();
    privateRoom && interceptChatRoomLeave(privateRoom?.id)
    .as('leaveRoom');
    
    // open leave modal
    cy.get(roomEl.leave.btn).click();
    cy.get(roomEl.leave.submit).click();
    cy.wait('@leaveRoom').then(()=>{
      cy.url().should('not.contain', `rooms/${privateRoom?.id}`)
    });
  })
  
  // Send Message
  it('sends message  correctly', ()=> {
    cy.wrap(privateRoom).should('not.be.null');
    cy.wrap(privateMember).should('not.be.null');
    privateRoom && privateMember && interceptChatRoomMessageSend(
      privateRoom?.id,
      privateMember?.id,
    ).as('sendMessage');
    visitPrivateRoom();
    

    const newMessage = 'New Message';
    typeOnInput(roomEl.sendMessage.message, newMessage);
    cy.get(roomEl.sendMessage.submit).click();
    cy.wait('@sendMessage').then((interception)=>{
      const data = interception.response?.body.success;
      cy.wrap(data.data.message).should('eq', newMessage);
      // Message should be empty on success
      cy.get(roomEl.sendMessage.message).should('be.empty');
      // New Message should be in the chat
      cy.contains(newMessage).should('exist');
    });
  })
  
  // Receives Message 
  it('receives message   correctly', ()=>{
    cy.wrap(privateRoom).should('not.be.null');
    cy.wrap(privateMember).should('not.be.null');
    privateRoom && privateMember && interceptChatRoomMessageSend(
      privateRoom?.id,
      privateMember?.id,
    ).as('sendMessage');
    visitPrivateRoom();
    
    const sampleUser = privateAdmin;
    if (privateRoom && sampleUser) {
      cy.wait('@messages').then(()=>{
        const body = {
          id: 5,
          room_id: privateRoom.id ,
          sender_id: sampleUser.id,
          message: 'Sample Message sent',
          updated_at: faker.date.recent().toISOString(),
          created_at: faker.date.recent().toISOString(),
        };
    
        onMessageCreated(privateRoom?.id, body);
        cy.contains(body.message).should('exist');
      })
    }


  })

})