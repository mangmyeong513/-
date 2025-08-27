export const Store = {
  DB:'ovra_fx_posts', NICK:'ovra_fx_nick', FLAGS:'ovra_fx_flags',
  uid:()=>Math.random().toString(36).slice(2)+Date.now().toString(36),
  load:(k,def)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):def }catch{ return def } },
  save:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
};
export const suggest=(...texts)=>{
  const STOP=["그리고","그래서","하지만","그러나","나는","우리는","너는","오늘","지금","정말","약간","너무","진짜","그냥","근데","하면","하려고","해서","하다","했다","하는","했더니","있다","없다","같다","보다"];
  const MAP={"우울":"위로","슬퍼":"위로","힘들":"위로","불안":"위로","행복":"기쁨","기뻐":"기쁨","시험":"수능","수능":"수능","공부":"공부","과제":"공부","친구":"친구","연애":"연애","사랑":"연애","게임":"게임","그림":"그림","음악":"음악","노래":"음악","학교":"학교","가족":"가족","운동":"운동","날씨":"날씨","비":"날씨","더워":"날씨","추워":"날씨"};
  const tk=t=>(t||"").toLowerCase().replace(/[\n.,!?~\-()\[\]{}'";:]/g," ").split(/\s+/).filter(Boolean);
  const words=texts.flatMap(tk); const counts={};
  for(const w of words){ if(w.length<2||STOP.includes(w)) continue; const k=MAP[w]||w; counts[k]=(counts[k]||0)+1 }
  const pref=["위로","기쁨","수능","공부","친구","연애","게임","그림","음악","학교","가족","운동","날씨"]; 
  const arr=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([k])=>k); const out=[];
  for(const p of pref){ if(arr.includes(p)) out.push(p) } for(const a of arr){ if(!out.includes(a)) out.push(a) }
  return out.slice(0,3);
};
