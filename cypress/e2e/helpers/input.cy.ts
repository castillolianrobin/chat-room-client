

export function inputErrorContains(inputTag:string, errorMessage:string|false) {
 const errorTag =  '[aria-label="error"]';
 if (errorMessage === false) {
  cy.get(inputTag).closest('.group').get(errorTag).should('not.exist');
 } else {
   cy.get(inputTag).closest('.group').get(errorTag).contains(errorMessage);
 }
}

export function typeOnInput(inputTag: string, value?: string | number, clear = false) {
  clear && cy.get(inputTag).clear(); 
  value && cy.get(inputTag).type(`${value}`);
  
}