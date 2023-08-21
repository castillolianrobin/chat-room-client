import { interceptPost } from "../../helpers/axios.cy";
import { typeOnInput } from "../../helpers/input.cy";

 
 /** LOGIN VALUEs */


export const loginForm = {
  submit:'button[type="submit"]',
  username: 'input[aria-label="Email"]',
  password:'input[aria-label="Password"]',
  error: '[aria-label="form-error"]',
} as const;

export function goToLogin() {
  cy.visit('/login')
}




export function login(username?:string, password?:string, submit?:boolean) {
  typeOnInput(loginForm.username, username, true);
  typeOnInput(loginForm.password, password, true);
    
  if (submit) {
    interceptLogin(username, password);
    // Submit Login form
    cy.get(loginForm.submit).click();
  }
}
 



/** LOGIN API INTERCEPTOR */

export function interceptLogin(username?: string, password?: string) {
  // Login success
  if (
    username === loginSuccessResponse.data.user.email && 
    password === 'pass123'
  ) {
    interceptPost('/login', { 
      statusCode: 200,
      body: loginSuccessResponse,
    });
  } 
  // Login failed
  else {
    interceptPost('/login', { 
      statusCode: 401,
      body: loginFailedResponse,
    });
  }
}


export const loginSuccessResponse = {
  message: "Login successful",
  data: {
    token: "45|Uy4dm3z5SZF6fLllM2gx0Ze3regEcjUkbTGm4Jgi",
    user: {
      id: 1, 
      first_name: "Juan", 
      last_name: "Cruz", 
      email: "test@email.com",
      created_at: "2023-07-17T08:38:14.000000Z",
      updated_at: "2023-07-17T08:38:14.000000Z",
      email_verified_at: null,
    },
  }
};

export const loginFailedResponse = {
  message: "Unauthorized", 
  errors: "Invalid credentials", 
  data: null,
};