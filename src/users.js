import { Store } from './store.js';
export const Users = {
  current:()=>Store.load(Store.NICK,null),
  set:(n)=>{ Store.save(Store.NICK,n); return n; },
  random:()=> "고양이#" + Math.floor(100+Math.random()*900),
  displayName:()=>Users.current()||"게스트"
};
