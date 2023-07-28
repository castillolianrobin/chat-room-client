import type { ChatRoomMessage } from "./ChatRoomMessages";
import { PresenceChannel } from "./types";

class ChatRoomsChannel extends PresenceChannel {

  constructor(roomId: number) {
    super(`room.${roomId}`);
  }

  /** 
   * event handler when new message is created 
   */
  onMessageCreated(callback: (param: NewMessage) => void) {
    this.channel?.bind('MessageCreated', callback)
  }
}

export default ChatRoomsChannel;


/** __TYPE DEFINITION__ */

export interface NewMessage { 
  message: ChatRoomMessage; 
  roomId: number 
}