import { inputErrorContains, typeOnInput } from "../helpers/input.cy";
import { loginSuccessResponse } from "./helpers/login.cy";
import { goToRegistration, register, registerForm, type RegisterForm } from "./helpers/register.cy";

describe('Register Page', () => {
  const requiredText = "shouldn't be empty";
  
  it('page exists', () => {
    goToRegistration();
  })

  // Username Validation
  it('validates email', () => {
    goToRegistration();
    // if not valid email
    typeOnInput(registerForm.username, 'asdsda');
    inputErrorContains(registerForm.username, 'valid email');
    // if required
    typeOnInput(registerForm.username, '', true);
    inputErrorContains(registerForm.username, requiredText);
    // if valid
    typeOnInput(registerForm.username, 'test@email.com');
    inputErrorContains(registerForm.username, false);
    
  })
  
  // Password Validation
  it('validates password', () => {
    goToRegistration();
    // If valid
    typeOnInput(registerForm.password, 'asdsda');
    inputErrorContains(registerForm.confirmPassword, false);
    // If empty
    typeOnInput(registerForm.password, '', true);
    inputErrorContains(registerForm.password, requiredText);
  })
  
  // Confirm Password Validation
  it('validates confirm password', () => {
    goToRegistration();
    const samePass = 'pass123';
    // if not match
    typeOnInput(registerForm.password, samePass);
    typeOnInput(registerForm.confirmPassword, 'asad');
    inputErrorContains(registerForm.confirmPassword, 'should match');
    
    // if empty
    typeOnInput(registerForm.confirmPassword, '', true);
    inputErrorContains(registerForm.confirmPassword, requiredText);
    
    // If valid
    typeOnInput(registerForm.confirmPassword, samePass, true);
    inputErrorContains(registerForm.confirmPassword, false);
  })
  
  // Submit Validation
  it('if user is existing', () => {
    goToRegistration();
    const existingUser = loginSuccessResponse.success.data.user;
    const _registerForm: RegisterForm = {
      email: existingUser.email,
      password: 'pass',
      password_confirmation: 'pass',
      first_name: 'test',
      last_name: 'test',
    };

    // IF email is taken
    let formError = "The email has already been taken";
    register(_registerForm).then(()=>{
      cy.get(registerForm.error).contains(formError);
      
      // IF password is not 6 char
      _registerForm.email = 'test2@email.com';
      register(_registerForm).then(()=>{
        formError = "The password must be at least 6 characters";
        cy.get(registerForm.error).contains(formError);

        // Registration Success
        _registerForm.password = 'pass123';
        _registerForm.password_confirmation = 'pass123';
        register(_registerForm).then(()=>{
          cy.contains('Successfully Registered').should('exist');
        });  
      });
    });
    
    
    
  })


});