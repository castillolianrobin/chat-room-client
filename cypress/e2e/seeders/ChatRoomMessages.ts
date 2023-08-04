import { faker } from "@faker-js/faker";
import { generateUser } from "./Users";

export function generateChatRoomMessage(id = 1, user?:User , room_id = 1, message = '') {
  return {
    id,
    user,
    sender_id: user?.id || 0,
    room_id,
    message: message ? message : faker.word.words(faker.number.int(20)),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.past().toISOString(),
  };
}


/** __TYPE DEFINITION__ */

type User = ReturnType<typeof generateUser>