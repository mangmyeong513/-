export const Store = {
  DB:'ovra_posts', NICK:'ovra_nick', TAGS:'ovra_tags',
  uid:()=>Math.random().toString(36).slice(2)+Date.now().toString(36),
  load:(k,def)=>{try{const v=localStorage.getItem(k); return v?JSON.parse(v):def}catch{return def}},
  save:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
};

export const TagKit={
  tokenize:(t='')=>t.toLowerCase().replace(/[\n.,!?~\-()\[\]{}'\";:]/g,' ').split(/\s+/).filter(Boolean),
  STOP:new Set(["그리고","그래서","하지만","나는","오늘","진짜","그냥","있다","없다","같다"]),
  MAP:{"우울":"위로","행복":"기쁨","시험":"수능","공부":"공부","친구":"친구","연애":"연애","사랑":"연애","게임":"게임","그림":"그림","음악":"음악","학교":"학교","가족":"가족","운동":"운동","날씨":"날씨"},
  suggest:(...texts)=>{
    const words=texts.flatMap(TagKit.tokenize);
    const cnt=new Map();
    for(const w of words){ if(w.length<2||TagKit.STOP.has(w)) continue; const k=TagKit.MAP[w]||w; cnt.set(k,(cnt.get(k)||0)+1) }
    return [...cnt.keys()].slice(0,5);
  },
  index:(posts)=>{ const idx=new Map(); for(const p of posts){ for(const t of p.tags||[]){ idx.set(t,(idx.get(t)||0)+1) } } return [...idx.entries()].sort((a,b)=>b[1]-a[1]) },
  followed:()=>Store.load(Store.TAGS,[]),
  toggleFollow:(tag)=>{ const f=new Set(TagKit.followed()); if(f.has(tag)) f.delete(tag); else f.add(tag); Store.save(Store.TAGS,[...f]); return [...f]; }
};