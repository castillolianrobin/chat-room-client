import { typeOnInput } from "../helpers/input.cy";
import { loginSuccessResponse } from "../public/helpers/login.cy";
import { chatRoomsSuccess, interceptChatRoomCreate, interceptChatRooms } from "./helpers/chatroom.cy";


describe('Chat room list Page', () => {
  const { token, user } = loginSuccessResponse.success.data;
  beforeEach(() => {
    window.localStorage.setItem('_auth_user', JSON.stringify({ ...user, token }));
    cy.visit('/chat/rooms');
  });

  // Displays loading properly
  it ('displays loading', () => {  
    cy.get('[aria-label="loading spinner"]').should('be.visible');
  })

  // Displays rooms properly
  it ('displays chat rooms properly', () => {
    interceptChatRooms();
    const rooms = chatRoomsSuccess.success.data;
    // should display rooms labels
    cy.contains('Public').should('exist');
    cy.contains('Private').should('exist');
    // should display all rooms
    for (const room of rooms) {
      cy.get(`a[href="/chat/room/${room.id}"]`).should('exist');
    }
  })
  
  
  const createRoomForm = 'form[aria-label="create room form"]';
  const createRoomBtn = 'button[aria-label="create room button"]';
  // Create room modal
  it ('displays create room modal properly', ()=> {
    interceptChatRooms();
    
    // Create room modal behaves properly
    cy.get(createRoomForm).should('not.exist');
    cy.get(createRoomBtn).click();
    cy.get(createRoomForm).should('exist');
    
    // Create room form behaves properly
    cy.get(createRoomForm).get('button[type="submit"]').click();
    // Validates properly
    cy.contains("field shouldn't be empty").should('exist');
  })
  
  it ('creates new chat room', ()=>{
    interceptChatRooms();
    cy.get(createRoomBtn).click();
    
    // Proper form submit
    interceptChatRoomCreate().as('createRoom');
    const roomName = 'New room';
    typeOnInput('[aria-label="Room Name"]', roomName);        
    cy.get(createRoomForm).get('button[type="submit"]').click();
    // create public room
    cy.wait('@createRoom').then((interception) => {
      const data   = interception.response?.body.success.data; 
      cy.wrap(data).its('name').should('eq', roomName);
      cy.wrap(data).its('is_private').should('eq', false);
      // Close when done
      cy.contains('Confirm').click();
    });

    // create private room
    cy.get('button[aria-label="create room button"]').click();
    typeOnInput('[aria-label="Room Name"]', roomName, true);        
    // make room private
    cy.get('[aria-label="Private room"]').click();
    cy.get(createRoomForm).get('button[type="submit"]').click();
    // create private room
    cy.wait('@createRoom').then((interception) => {
      const data   = interception.response?.body.success.data; 
      cy.wrap(data).its('name').should('eq', roomName);
      cy.wrap(data).its('is_private').should('eq', true);
      // Close when done
      cy.contains('Confirm').click();
    });
  })
  
  // Go to correct room
  it ('opens chat room properly', ()=>{
    interceptChatRooms();
    const roomLink = '/chat/room/1';
    cy.get(`a[href="${roomLink}"]`).click();
    cy.url().should('contain', roomLink);
  })
})



/** __HELPERS__ */


