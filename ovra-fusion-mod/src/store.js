export const Store = {
  DB:'ovra_tw_posts', NICK:'ovra_tw_nick', TAGS:'ovra_tw_followed',
  uid:()=>Math.random().toString(36).slice(2)+Date.now().toString(36),
  load:(k,def)=>{try{const v=localStorage.getItem(k); return v?JSON.parse(v):def}catch{return def}},
  save:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
};

export const TagKit={
  tokenize:(t='')=>t.toLowerCase().replace(/[\n.,!?~\-()\[\]{}'\";:]/g,' ').split(/\s+/).filter(Boolean),
  STOP:new Set(["그리고","그래서","하지만","그러나","나는","우리는","너는","오늘","지금","정말","약간","너무","진짜","그냥","근데","하면","하려고","해서","하다","했다","하는","했더니","있다","없다","같다","보다"]),
  MAP:{"우울":"위로","슬퍼":"위로","힘들":"위로","불안":"위로","행복":"기쁨","기뻐":"기쁨","시험":"수능","수능":"수능","공부":"공부","과제":"공부","친구":"친구","연애":"연애","사랑":"연애","게임":"게임","그림":"그림","음악":"음악","노래":"음악","학교":"학교","가족":"가족","운동":"운동","날씨":"날씨","비":"날씨","더워":"날씨","추워":"날씨"},
  suggest:(...texts)=>{
    const words=texts.flatMap(TagKit.tokenize);
    const cnt=new Map();
    for(const w of words){ if(w.length<2||TagKit.STOP.has(w)) continue; const k=TagKit.MAP[w]||w; cnt.set(k,(cnt.get(k)||0)+1) }
    const prefer=["위로","기쁨","수능","공부","친구","연애","게임","그림","음악","학교","가족","운동","날씨"];
    const arr=[...cnt.entries()].sort((a,b)=>b[1]-a[1]).map(([k])=>k);
    const out=[]; for(const p of prefer){ if(arr.includes(p)) out.push(p) } for(const a of arr){ if(!out.includes(a)) out.push(a) }
    return out.slice(0,5);
  },
  index:(posts)=>{ const idx=new Map(); for(const p of posts){ for(const t of p.tags||[]){ idx.set(t,(idx.get(t)||0)+1) } } return [...idx.entries()].sort((a,b)=>b[1]-a[1]) },
  followed:()=>Store.load(Store.TAGS,[]),
  toggleFollow:(tag)=>{ const f=new Set(TagKit.followed()); if(f.has(tag)) f.delete(tag); else f.add(tag); Store.save(Store.TAGS,[...f]); return [...f]; }
};
