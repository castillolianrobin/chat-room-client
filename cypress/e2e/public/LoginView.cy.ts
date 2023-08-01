import { loginForm, login, goToLogin } from '../public/helpers/login.cy'; 
import { inputErrorContains } from '../helpers/input.cy';
describe('Login Page', () => {
  const requiredText = "shouldn't be empty";
  

  /** TESTS */
  
  it('page exists', () => {
    goToLogin();
  })
  
  // Username Validation
  it('validates email', ()=> {
    goToLogin();
    login('', '', true);
    inputErrorContains(loginForm.username, requiredText);
    login('username', '', true);
    inputErrorContains(loginForm.username, 'not a valid email');
    login('username@gmail.com', '', true);
  })

  // Password Validation
  it('validates password', ()=> {
    goToLogin();
    login('', '', true);
    inputErrorContains(loginForm.password, requiredText);
  })

  // // Submit Validation
  it('redirects to /chats if valid', ()=> {
    goToLogin();
    login('username@gmail.com', 'random', true);
    const formError = "Unauthorized";
    cy.get(loginForm.error).contains(formError);
    
    login('test@email.com', 'pass123', true);
    cy.url().should('contain', '/chat');
  })
})
