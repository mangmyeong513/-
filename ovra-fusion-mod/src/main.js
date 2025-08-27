import {Store, suggest} from './store.js';
import {Users} from './users.js';
import {Moderation} from './moderation.js';
import {InkCat, Smudge} from './components.js';

const uid = Store.uid;

// Toast & Login components (lightweight)
const Toast = ({msg}) => React.createElement('div',{className:'pointer-events-auto card px-3 py-2 text-sm shadow-xl', style:{animation:'fadein .25s ease'}}, msg);
const LoginModal = ({open,onClose,onSubmit}) => open? (
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-black/20" onClick={onClose}></div>
    <div className="absolute inset-0 m-auto max-w-sm h-fit p-4 card">
      <div className="font-semibold mb-2">간단 로그인</div>
      <p className="text-sm text-[color:var(--muted)] mb-3">닉네임만으로 시작해요.</p>
      <input id="loginNick" className="w-full mb-2 rounded-lg px-3 py-2 bg-transparent border border-[color:var(--line)]" placeholder="닉네임 (예: 묵향고양이#123)"/>
      <div className="flex justify-end gap-2"><button className="btn-sub" onClick={onClose}>취소</button><button className="btn" onClick={()=>{const v=document.getElementById('loginNick').value.trim(); if(!v) return; onSubmit(v)}}>시작</button></div>
    </div>
  </div>
): null;

// Small atoms
const Tag = ({children}) => <span className="chip">#{children}</span>;

const Header = ({nick,onSearch,mode,setMode,toggleDark,isDark,onLogin,onLogout,unread,toastsOpen,setToastsOpen}) => (
  <header className="sticky top-0 z-40 bg-[color:var(--paper)]/85 backdrop-blur border-b border-[color:var(--line)]">
    <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-8"><Smudge className="absolute -top-5 -left-3 w-16"/><InkCat className="absolute -top-5 -left-5 w-14" alpha={.5}/></div>
        <h1 className="text-lg font-extrabold tracking-wide">OVRA</h1>
      </div>
      <nav className="ml-4 flex gap-4 text-sm text-[color:var(--muted)]">
        {['feed','lists','explore'].map(m=> (
          <button key={m} className={'pb-1 '+(mode===m?'text-[color:var(--text)] border-b-2 border-[color:var(--text)]':'hover:text-[color:var(--text)]')} onClick={()=>setMode(m)}>{m==='feed'?'피드':m==='lists'?'리스트':'탐색'}</button>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <input onChange={e=>onSearch(e.target.value)} placeholder="검색…" className="w-36 sm:w-52 md:w-72 lg:w-96 rounded-xl px-3 py-2 bg-transparent border border-[color:var(--line)] placeholder-[color:var(--muted)] outline-none"/>
        <button className="btn-sub" onClick={toggleDark}>{isDark?'☀️':'🌙'}</button>
        <button className="btn-sub" onClick={()=>setToastsOpen(v=>!v)}>🔔{unread>0?` ${unread}`:''}</button>
        {nick? (<><span className="text-xs text-[color:var(--muted)]">{nick}</span><button className="btn-sub" onClick={onLogout}>로그아웃</button></>)
              : (<button className="btn" onClick={onLogin}>로그인</button>)}
      </div>
    </div>
  </header>
);

const PostCard = ({post,me,actions}) => {
  const liked = post.likedBy.includes(me); const bm = post.bookmarkedBy.includes(me);
  return (
    <article className="card press-3d overflow-hidden">
      <div className="relative p-4">
        <Smudge className="absolute -top-10 -right-6 w-40 animate-float pointer-events-none"/>
        <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
          <div className="h-8 w-8 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center">{post.author[0]}</div>
          <button className="hover:underline" onClick={()=>actions.openProfile(post.author)}>{post.author}</button>
          <span>· {new Date(post.ts).toLocaleString()}</span>
          {post.pinned && <span className="ml-2 chip">핀 고정</span>}
        </div>
        <h3 className="mt-2 font-semibold">{post.title||'(제목 없음)'}</h3>
        <p className="mt-1 leading-relaxed line-clamp-4">{post.body}</p>
        {post.image && <img src={post.image} className="mt-3 rounded-xl border border-[color:var(--line)] max-h-96 object-cover w-full"/>}
        {post.quoteOf && (
          <div className="mt-3 p-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]">
            <div className="text-[10px] text-[color:var(--muted)] mb-1">옴표</div>
            <div className="text-sm font-semibold">{post.quoteOf.title}</div>
            <div className="text-xs text-[color:var(--muted)]">{post.quoteOf.author}</div>
            <div className="text-sm">{post.quoteOf.body}</div>
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">{post.tags.map(t=> <Tag key={t}>{t}</Tag>)}</div>
      </div>
      <div className="flex items-center justify-between border-t border-[color:var(--line)] px-3 py-2 text-sm text-[color:var(--muted)]">
        <div className="flex gap-4 items-center">
          <button onClick={()=>actions.like(post.id)} className={liked?'font-semibold':''}>{liked?'♥':'♡'} {post.likes}</button>
          <button onClick={()=>actions.openDetail(post.id)}>댓글 {post.comments.length}</button>
          <button onClick={()=>actions.quote(post.id)}>옴표</button>
          <button onClick={()=>actions.bookmark(post.id)} className={bm?'font-semibold':''}>{bm?'🔖해제':'🔖북마크'}</button>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={()=>actions.report(post.id)}>신고{post.reports?`(${post.reports})`:''}</button>
          {me===post.author && <button onClick={()=>actions.del(post.id)}>삭제</button>}
        </div>
      </div>
    </article>
  );
};

const Composer = ({nick,onPost,quote}) => {
  const [title,setTitle] = React.useState('');
  const [body,setBody] = React.useState('');
  const [tags,setTags] = React.useState([]);
  const [tagInput,setTagInput]=React.useState('');
  const [img,setImg]=React.useState(null);
  React.useEffect(()=>{ setTags(suggest(title+' '+body)) },[title,body]);
  const onFile = async e=>{
    const f=e.target.files?.[0]; if(!f) return;
    const bmp=await createImageBitmap(f); const c=document.createElement('canvas'); const s=Math.min(1,1200/bmp.width);
    c.width=Math.round(bmp.width*s); c.height=Math.round(bmp.height*s); c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
    setImg(c.toDataURL('image/jpeg',.82));
  };
  const submit=()=>{ if(!title.trim()&&!body.trim()&&!img) return; onPost({title,body,tags,image:img,quote}); setTitle(''); setBody(''); setTags([]); setImg(null) };
  return (
    <div className="card p-4 press-3d">
      <div className="flex gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center">{nick?nick[0]:'?'}</div>
        <div className="flex-1">
          <input className="w-full mb-2 rounded-lg px-3 py-2 bg-transparent border border-[color:var(--line)] placeholder-[color:var(--muted)] outline-none" placeholder="제목" value={title} onChange={e=>setTitle(e.target.value.slice(0,80))}/>
          <textarea className="w-full min-h-24 resize-y rounded-lg bg-transparent p-3 outline-none border border-[color:var(--line)] placeholder-[color:var(--muted)]" placeholder="무슨 일이 일어나고 있나요?" value={body} onChange={e=>setBody(e.target.value.slice(0,400))}/>
          {img && <img src={img} className="mt-2 rounded-lg border border-[color:var(--line)] max-h-72 object-cover"/>}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {tags.map(t=> <span key={t} className="chip">#{t}</span>)}
            <input value={tagInput} onChange={e=>setTagInput(e.target.value)} placeholder="#태그추가" className="rounded-lg px-2 py-1 bg-transparent border border-[color:var(--line)] outline-none"/>
            <button className="text-xs text-[color:var(--muted)]" onClick={()=>{ if(tagInput&&!tags.includes(tagInput)) setTags([...tags,tagInput]); setTagInput('') }}>추가</button>
            <label className="ml-auto text-xs cursor-pointer text-[color:var(--muted)] hover:underline"><input type="file" accept="image/*" className="hidden" onChange={onFile}/>이미지</label>
          </div>
          {quote && (
            <div className="mt-3 p-3 rounded-xl border border-[color:var(--line)]"><div className="text-[10px] text-[color:var(--muted)] mb-1">옴표 대상</div><div className="font-semibold">{quote.title}</div><div className="text-xs text-[color:var(--muted)]">{quote.author}</div><div>{quote.body}</div></div>
          )}
          <div className="mt-3 flex justify-end gap-2"><button className="btn-sub" onClick={()=>{setTitle('');setBody('');setImg(null)}}>지우기</button><button className="btn" onClick={submit}>게시</button></div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({post,onClose,addComment,delComment,me,quote}) => {
  const [txt,setTxt]=React.useState('');
  return (
    <div>
      <div className="flex items-center gap-3 mb-3"><button className="btn-sub" onClick={onClose}>닫기</button><h3 className="font-semibold">상세 보기</h3></div>
      <div className="card p-4">
        <div className="text-xs text-[color:var(--muted)] mb-1">{post.author} · {new Date(post.ts).toLocaleString()}</div>
        <div className="font-semibold">{post.title}</div>
        <p className="mt-1">{post.body}</p>
        {post.image && <img src={post.image} className="mt-2 rounded-lg border border-[color:var(--line)] max-h-96 object-cover w-full"/>}
        <div className="mt-2 flex gap-2 flex-wrap">{post.tags.map(t=> <Tag key={t}>{t}</Tag>)}</div>
        <div className="mt-3 text-sm text-[color:var(--muted)]"><button className="hover:underline" onClick={()=>quote(post.id)}>옴표</button></div>
      </div>

      <div className="mt-4 card p-4">
        <div className="text-sm text-[color:var(--muted)] mb-2">댓글 {post.comments.length}</div>
        <div className="space-y-3 max-h-56 overflow-auto pr-1">
          {post.comments.map(c=> (
            <div key={c.id} className="p-3 rounded-xl border border-[color:var(--line)]">
              <div className="flex items-center justify-between"><div className="text-xs text-[color:var(--muted)]">{c.author} · {new Date(c.ts).toLocaleString()}</div><div className="text-xs text-[color:var(--muted)] flex gap-2">{me===c.author && <button className="hover:underline" onClick={()=>delComment(post.id,c.id)}>삭제</button>}<button className="hover:underline" onClick={()=>Moderation.push({id:uid(),type:'comment',pid:post.id,cid:c.id,author:c.author,ts:Date.now(),text:c.text})}>신고</button></div></div>
              <div className="mt-1">{c.text}</div>
            </div>
          ))}
          {post.comments.length===0 && <div className="text-[color:var(--muted)] text-sm">아직 댓글이 없어요.</div>}
        </div>
        <div className="mt-3 flex gap-2"><input value={txt} onChange={e=>setTxt(e.target.value.slice(0,160))} placeholder="한 줄 댓글" className="flex-1 rounded-lg px-3 py-2 bg-transparent border border-[color:var(--line)] placeholder-[color:var(--muted)] outline-none"/><button className="btn" onClick={()=>{ if(!txt.trim())return; addComment(post.id,txt); setTxt('') }}>등록</button></div>
      </div>
    </div>
  );
};

const Modal=({open,onClose,children})=> open? (
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-black/10" onClick={onClose}></div>
    <div className="absolute inset-x-0 bottom-0 md:inset-0 md:m-auto md:h-[84vh] max-h-[92vh] overflow-auto mx-2 md:mx-auto md:max-w-2xl card p-4">{children}</div>
  </div>
):null;

function App(){
  const [nick,setNick]=React.useState(Users.current());
  const [posts,setPosts]=React.useState(Store.load(Store.DB, []));
  const [search,setSearch]=React.useState('');
  const [mode,setMode]=React.useState('feed');
  const [quoteOf,setQuoteOf]=React.useState(null);
  const [detailId,setDetailId]=React.useState(null);
  const [visible,setVisible]=React.useState(8);
  const [isDark,setDark]=React.useState(document.documentElement.classList.contains('dark'));
  const [loginOpen,setLoginOpen]=React.useState(!Users.loggedIn());
  const [toasts,setToasts]=React.useState([]);
  const [unread,setUnread]=React.useState(0);
  const [toastsOpen,setToastsOpen]=React.useState(false);
  const bcRef=React.useRef(null);

  const pushToast=(msg)=>{ setToasts(t=>[...t,{id:uid(),msg}]); setUnread(u=>u+1); if('Notification' in window && Notification.permission==='granted'){ try{new Notification('OVRA',{body:msg})}catch{}} };

  React.useEffect(()=>Users.set(nick),[nick]);
  React.useEffect(()=>{Store.save(Store.DB,posts); localStorage.setItem('ovra_fx_rev', String(Date.now()))},[posts]);

  // seed
  React.useEffect(()=>{ if(posts.length===0){ setPosts([
    {id:uid(),title:'종이에 번지는 공지',body:'잉크는 말수가 적고, 대신 오래 남아.',tags:['공지','업데이트'],author:'시스템',ts:Date.now()-900000,likes:3,likedBy:[],bookmarkedBy:[],image:null,comments:[],reports:0,pinned:true},
  ])}},[]);

  // infinite scroll
  React.useEffect(()=>{ const f=()=>{ if((window.innerHeight+window.scrollY)>=document.body.offsetHeight-200){ setVisible(v=>Math.min(v+6, filtered().length)) } }; window.addEventListener('scroll',f); return ()=>window.removeEventListener('scroll',f) },[posts,search,mode]);

  // realtime (BroadcastChannel + storage)
  React.useEffect(()=>{
    if('BroadcastChannel' in window){ bcRef.current=new BroadcastChannel('ovra_fx'); bcRef.current.onmessage=(e)=>{
      if(e.data?.type==='new-post'){ setPosts(p=>[e.data.post,...p]); pushToast('새 글: '+e.data.post.title) }
      if(e.data?.type==='new-comment'){ setPosts(ps=>ps.map(x=>x.id===e.data.pid?{...x,comments:[...x.comments,e.data.comment]}:x)); pushToast('새 댓글 도착') }
    }}
    const onStorage=(e)=>{ if(e.key==='ovra_fx_rev'){ setPosts(Store.load(Store.DB, posts)) } };
    window.addEventListener('storage',onStorage);
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('/sw.js').catch(()=>{}) }
    if('Notification' in window && Notification.permission==='default'){ Notification.requestPermission() }
    return ()=>{ window.removeEventListener('storage',onStorage); bcRef.current?.close?.() }
  },[]);

  const toggleDark=()=>{ document.documentElement.classList.toggle('dark'); setDark(d=>!d) };

  const onPost=({title,body,tags,image,quote})=>{
    if(!Users.loggedIn()){ setLoginOpen(true); return }
    const p={id:uid(),title,body,tags,author:nick,ts:Date.now(),likes:0,likedBy:[],bookmarkedBy:[],image,comments:[],reports:0};
    if(quote){ p.quoteOf={id:quote.id,title:quote.title,author:quote.author,body:quote.body} }
    setPosts([p,...posts]); setQuoteOf(null); window.scrollTo({top:0,behavior:'smooth'});
    try{ bcRef.current?.postMessage?.({type:'new-post',post:p}) }catch{}
  };
  const like=id=>setPosts(ps=>ps.map(p=>p.id===id?{...p,likedBy:p.likedBy.includes(nick)?p.likedBy.filter(u=>u!==nick):[...p.likedBy,nick],likes:p.likedBy.includes(nick)?Math.max(0,p.likes-1):p.likes+1}:p));
  const bookmark=id=>setPosts(ps=>ps.map(p=>p.id===id?{...p,bookmarkedBy:p.bookmarkedBy.includes(nick)?p.bookmarkedBy.filter(u=>u!==nick):[...p.bookmarkedBy,nick]}:p));
  const addComment=(pid,text)=>{
    if(!Users.loggedIn()){ setLoginOpen(true); return }
    const c={id:uid(),author:nick,text,ts:Date.now()};
    setPosts(ps=>ps.map(p=>p.id===pid?{...p,comments:[...p.comments,c]}:p));
    try{ bcRef.current?.postMessage?.({type:'new-comment',pid,comment:c}) }catch{}
  };
  const delComment=(pid,cid)=>setPosts(ps=>ps.map(p=>p.id===pid?{...p,comments:p.comments.filter(c=>c.id!==cid)}:p));
  const del=id=>setPosts(ps=>ps.filter(p=>p.id!==id));
  const report=id=>{ setPosts(ps=>ps.map(p=>p.id===id?{...p,reports:(p.reports||0)+1}:p)); const p=posts.find(x=>x.id===id); Moderation.push({id:uid(),type:'post',pid:id,author:p?.author,title:p?.title,ts:Date.now(),text:p?.body}) };
  const openProfile=author=>setMode({mode:'profile',who:author===nick?'me':author});
  const openDetail=id=>setDetailId(id);
  const quote=id=>{const p=posts.find(x=>x.id===id); if(p) setQuoteOf({id:p.id,title:p.title,author:p.author,body:p.body})};

  function filtered(){
    let list=posts.slice();
    if(typeof mode==='object'&&mode.mode==='profile'){ const who=mode.who==='me'?nick:mode.who; list=list.filter(p=>p.author===who) }
    else if(mode==='lists'){ list=posts.filter(p=>p.bookmarkedBy.includes(nick)) }
    if(search.trim()){ const k=search.toLowerCase(); list=list.filter(p=>[p.title,p.body,p.author,...p.tags].join(' ').toLowerCase().includes(k)) }
    return list;
  }
  const list=filtered(); const me=nick; const detail=posts.find(p=>p.id===detailId)||null;

  return (
    <div>
      <Header nick={nick}
        onSearch={setSearch}
        mode={mode==='feed'? 'feed': (mode==='lists'?'lists':(typeof mode==='object'?'feed':'explore'))}
        setMode={m=>setMode(m)}
        toggleDark={toggleDark} isDark={isDark}
        onLogin={()=>setLoginOpen(true)} onLogout={()=>{ localStorage.removeItem(Store.NICK); setNick(null); }}
        unread={unread} toastsOpen={toastsOpen} setToastsOpen={setToastsOpen}
      />

      <div className="mx-auto max-w-[1200px] px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="hidden lg:block col-span-2 space-y-2 sticky top-20 h-fit">
          <button className="btn w-full">게시하기</button>
          <button className="btn-sub w-full" onClick={()=>setNick(Users.random())}>닉네임 변경</button>
          <div className="card p-3 text-sm text-[color:var(--muted)]">관리자 모드 <input type="checkbox" className="ml-2" checked={Users.isAdmin()} onChange={e=>Users.setAdmin(e.target.checked)}/></div>
          <div className="card p-3"><div className="font-semibold mb-2">빠른 필터</div><div className="flex flex-wrap gap-2">{['공지','업데이트','고양이','메모'].map(t=><span className="chip cursor-pointer" key={t} onClick={()=>setSearch(t)}>{t}</span>)}</div></div>
        </aside>

        <section className="col-span-12 lg:col-span-7 space-y-5">
          <Composer nick={nick} onPost={onPost} quote={quoteOf}/>
          {list.length===0 && <div className="text-center text-[color:var(--muted)]">결과가 없어요.</div>}
          <div className="space-y-5">
            {list.slice(0,visible).map(p=> (
              <PostCard key={p.id} post={p} me={me} actions={{like,bookmark,openDetail,quote,openProfile,report,del}}/>
            ))}
          </div>
          {visible<list.length && <div className="text-center text-[color:var(--muted)]">스크롤하면 더 불러와요…</div>}
        </section>

        <aside className="hidden md:block col-span-3 space-y-4">
          <div className="card p-4 relative overflow-hidden">
            <Smudge className="absolute -top-10 -left-6 w-40"/><div className="font-semibold">크리에이터용 소식</div>
            <p className="text-sm text-[color:var(--muted)] mt-1">업데이트, 팁, 이슈.</p>
            <ul className="mt-2 text-sm list-disc pl-5 text-[color:var(--muted)]"><li>신고 큐 관리자 보드</li><li>핀 고정 지원</li></ul>
          </div>
          <div className="card p-3"><div className="font-semibold mb-2">트렌딩</div><div className="space-y-2 text-sm"><div className="flex items-center gap-2"><span className="chip">#고양이</span> <span className="text-[color:var(--muted)]">3.1K</span></div><div className="flex items-center gap-2"><span className="chip">#메모</span> <span className="text-[color:var(--muted)]">1.2K</span></div></div></div>
          <div className="card p-3"><div className="font-semibold mb-2">북마크</div>{list.filter(p=>p.bookmarkedBy.includes(me)).slice(0,4).map(p=> <div key={p.id} className="text-sm line-clamp-2 border-t border-[color:var(--line)] py-2 first:border-t-0">{p.title}</div>)}</div>
        </aside>
      </div>

      <footer className="mx-auto max-w-[1200px] px-4 py-10 text-center text-xs text-[color:var(--muted)]">© {new Date().getFullYear()} OVRA · fusion ui</footer>

      <Modal open={!!detail} onClose={()=>setDetailId(null)}>
        {detail && <Detail post={detail} onClose={()=>setDetailId(null)} addComment={addComment} delComment={delComment} me={me} quote={quote}/>}
      </Modal>

      {/* Toasts */}
      <div className={`fixed bottom-4 right-4 flex flex-col gap-2 z-50 ${toastsOpen?'':'pointer-events-none'}`}>
        {toasts.slice(-5).map(t=> <Toast key={t.id} msg={t.msg} />)}
      </div>

      {/* floating cats */}
      <div className="pointer-events-none fixed right-2 top-24 w-28 opacity-50"><InkCat mood={1} alpha={.18}/></div>
      <div className="pointer-events-none fixed left-0 bottom-10 w-40 opacity-40"><InkCat mood={3} alpha={.12}/></div>

      {/* Login */}
      <LoginModal open={loginOpen} onClose={()=>setLoginOpen(false)} onSubmit={(v)=>{ Users.set(v); setNick(v); setLoginOpen(false); }}/>
    </div>
  );
}

const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
