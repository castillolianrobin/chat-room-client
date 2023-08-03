import { faker } from "@faker-js/faker"

export function generateUser(id = 1) {
  return {
    id,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
    email_verified_at: null,
  }
}