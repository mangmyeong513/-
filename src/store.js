export const Store = {
  DB: 'ovra_posts', NICK: 'ovra_nick',
  uid: () => Math.random().toString(36).slice(2)+Date.now().toString(36),
  load: (k,def)=>{ try{const v=localStorage.getItem(k); return v?JSON.parse(v):def;}catch{return def}},
  save: (k,v)=>localStorage.setItem(k,JSON.stringify(v))
};
