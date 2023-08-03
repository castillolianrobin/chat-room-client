import { faker } from "@faker-js/faker";


export function generateChatRoomMember(id = 1, user_id = 1, chat_room_id = 1, is_admin = false) {
  return {
    id,
    user_id,
    chat_room_id,
    is_admin: is_admin ? 1 : 0,
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
  };
}