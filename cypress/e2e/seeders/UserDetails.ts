import { faker } from "@faker-js/faker"

export function generateUserDetail(id = 1, user_id = 1) {
  return {
    id,
    user_id,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    middle_name: faker.person.middleName(),
    color: faker.color.rgb(),
    profile_img_url: faker.image.avatar(),
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
  }
}