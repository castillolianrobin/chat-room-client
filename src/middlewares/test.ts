import type { RouterMiddleWare } from './index';


const test:RouterMiddleWare = (context) => {
  return context.next();
} 

export default test;