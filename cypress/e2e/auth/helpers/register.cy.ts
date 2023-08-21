import { interceptPost } from "../../helpers/axios.cy";
import { typeOnInput } from "../../helpers/input.cy";
import { loginSuccessResponse } from "./login.cy";

export const registerForm = {
  submit:'button[type="submit"]',
  username: 'input[aria-label="Email"]',
  password:'input[aria-label="Password"]',
  confirmPassword:'input[aria-label="Verify Password"]',
  first_name:'input[aria-label="First Name"]',
  last_name:'input[aria-label="Last Name"]',
  error: '[aria-label="form-error"]',
} as const;


export function goToRegistration() {
  cy.visit('/register')
}

export function register(form: RegisterForm) {
  typeOnInput(registerForm.username, form.email, true);
  typeOnInput(registerForm.password, form.password, true);
  typeOnInput(registerForm.confirmPassword, form.password_confirmation, true);
  typeOnInput(registerForm.first_name, form.first_name, true);
  typeOnInput(registerForm.last_name, form.last_name, true);
  
  interceptRegister(form);
  cy.get(registerForm.submit).click();
  return cy.wait('@register')
}


/** Register API interceptor */


export function interceptRegister(form: RegisterForm) {
  const existingEmail = loginSuccessResponse.data.user.email;
  const errors: { email?: string, password?: string } = {};
  // Email Exizting 
  console.log(form.email, existingEmail);
  if (form.email === existingEmail) {
    errors.email = 'The email has already been taken.';
  }
  // API password length
  else if (form.password.length < 6) {
    errors.password = 'The password must be at least 6 characters';
  }


  if (Object.keys(errors).length > 0) {
    const body = { ...registerFailedResponse };
    body.errors = errors;
    interceptPost('/register', {
      statusCode: 422,
      body,
    }).as('register');
  } else {
    const body = { ...registerSuccessResponse };
    body.data = {
      user: {
        ...form,
        id: 2,
      },
    };
    interceptPost('/register', {
      statusCode: 201,
      body,
    }).as('register');
  }

}


export const registerSuccessResponse = {
  data: {},
  message: 'Registration successful',
}


export const registerFailedResponse = {
  data: null,
  errors: {},
  message: 'The given data was invalid.',
}


/** __TYPE DEFINITION__ */

export type RegisterForm = {
  email: string,
  password: string,
  password_confirmation: string,
  first_name: string,
  last_name: string,
};