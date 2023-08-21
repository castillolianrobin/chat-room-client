import type { RouteHandler } from 'cypress/types/net-stubbing';
  
// @ts-ignore
const baseURL = import.meta.env.VITE_API_URL  || 'http://localhost:8000/api';

export function interceptGet(url:string, response?: RouteHandler) {
  const apiEndpoint = baseURL + url;
  return cy.intercept('GET', apiEndpoint, response);
}


export function interceptPost(url:string, response: RouteHandler) {
  const apiEndpoint = baseURL + url;
  return cy.intercept('POST', apiEndpoint, response);
}


// export function interceptPost(url:string, response: RouteHandler) {
//   const { baseURL } = axios.defaults;
//   const apiEndpoint = baseURL + url;
//   cy.intercept('POST', apiEndpoint, response)
// }
