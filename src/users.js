import {Store} from './store.js';
export const Users={
  current:()=>Store.load(Store.NICK,null),
  set:(n)=>Store.save(Store.NICK,n),
  random:()=>{const a=["서늘","묵향","새벽"], b=["고양이","수달","너구리"];return a[Math.floor(Math.random()*a.length)]+b[Math.floor(Math.random()*b.length)]+"#"+Math.floor(100+Math.random()*900)},
  loggedIn:()=>!!Store.load(Store.NICK,null),
};