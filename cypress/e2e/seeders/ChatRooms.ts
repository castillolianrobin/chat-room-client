import { faker } from "@faker-js/faker";

export function generateChatRoom(id = 1, name = '', is_private = false) {
  return {
    id,
    name: name || faker.commerce.department(),
    is_private: is_private ? 1 : 0,
    members_count: faker.number.int(100),
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
  };
}