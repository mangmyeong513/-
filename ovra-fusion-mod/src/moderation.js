import {Store} from './store.js';
export const Moderation={
  list:()=>Store.load('ovra_fx_reports',[]),
  push:(item)=>{const a=Moderation.list(); a.unshift(item); Store.save('ovra_fx_reports',a)},
  remove:(id)=>Store.save('ovra_fx_reports',Moderation.list().filter(x=>x.id!==id))
};
