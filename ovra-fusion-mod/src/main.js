import {Store, TagKit} from './store.js';
import {Users} from './users.js';
import {InkCat, Smudge} from './components.js';

const uid=Store.uid;
const Toast=({msg})=> <div className="card px-3 py-2 text-sm shadow-xl animate-fadeslide">{msg}</div>;
const TagChip=({tag,active,count,onClick,following,onFollow})=> (
  <button onClick={onClick}
    className={"chip transition-colors duration-150 me-2 mb-2 " + (active?'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-black':' hover:border-zinc-400')}
    title={count?`${count} posts`:''}>
    <span>#{tag}</span>
    {following?.includes(tag)? <span className="text-[10px] ms-1">●</span>: null}
    {onFollow && <span onClick={(e)=>{e.stopPropagation(); onFollow(tag)}} className="ms-2 text-[10px] opacity-70 hover:opacity-100">{following?.includes(tag)?'언팔로우':'팔로우'}</span>}
  </button>
);

const Header=({nick,onSearch,mode,setMode,toggleDark,isDark,unread,toastsOpen,setToastsOpen,selectedTags,clearTags})=> (
  <header className="sticky top-0 z-40 bg-[var(--paper)]/85 backdrop-blur border-b border-[color:var(--line)]">
    <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-8"><Smudge className="absolute -top-5 -left-3 w-16 animate-tilt"/><InkCat className="absolute -top-5 -left-5 w-14 animate-ink" alpha={.5}/></div>
        <h1 className="text-lg font-extrabold tracking-wide">OVRA</h1>
      </div>
      <nav className="ms-4 flex gap-4 text-sm text-[color:var(--muted)]">
        {['feed','tags','explore'].map(m=> (
          <button key={m} className={'pb-1 transition-colors ' + (mode===m?'text-[color:var(--text)] border-b-2 border-[color:var(--text)]':'hover:text-[color:var(--text)]/80')} onClick={()=>setMode(m)}>{m==='feed'?'피드':m==='tags'?'태그':'탐색'}</button>
        ))}
      </nav>
      <div className="ms-auto flex items-center gap-2">
        <input onChange={e=>onSearch(e.target.value)} placeholder="검색…" className="w-36 sm:w-52 md:w-72 lg:w-96 rounded-xl px-3 py-2 bg-transparent border border-[color:var(--line)] placeholder-[color:var(--muted)] outline-none"/>
        {selectedTags.length>0 && <button className="btn-sub text-xs" onClick={clearTags}>태그 해제 ×{selectedTags.length}</button>}
        <button className="btn-sub" onClick={toggleDark}>{isDark?'☀️':'🌙'}</button>
        <button className="btn-sub" onClick={()=>setToastsOpen(v=>!v)}>🔔{unread>0?` ${unread}`:''}</button>
        <span className="text-xs text-[color:var(--muted)]">{nick||'게스트'}</span>
      </div>
    </div>
  </header>
);

const Composer=({nick,onPost,tagIndex})=>{
  const [title,setTitle]=React.useState('');
  const [body,setBody]=React.useState('');
  const [img,setImg]=React.useState(null);
  const [tags,setTags]=React.useState([]);
  const [draft,setDraft]=React.useState('');
  React.useEffect(()=>{ setTags(TagKit.suggest(title+' '+body)) },[title,body]);

  const onFile=async e=>{ const f=e.target.files?.[0]; if(!f) return; const bmp=await createImageBitmap(f); const c=document.createElement('canvas'); const s=Math.min(1,1200/bmp.width); c.width=Math.round(bmp.width*s); c.height=Math.round(bmp.height*s); c.getContext('2d').drawImage(bmp,0,0,c.width,c.height); setImg(c.toDataURL('image/jpeg',.82)) };
  const addTag=t=>{ if(!t) return; if(!tags.includes(t)) setTags([...tags,t]); setDraft('') };
  const suggestList = tagIndex.filter(([t])=>t.includes(draft)).slice(0,6);

  return (
    <div className="card p-4 press-3d perspective-1k">
      <div className="flex gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--paper)] border border-[color:var(--line)] flex items-center justify-center">{nick?nick[0]:'?'}</div>
        <div className="flex-1">
          <input className="w-full mb-2 rounded-lg px-3 py-2 bg-transparent border border-[color:var(--line)] placeholder-[color:var(--muted)] outline-none transition-colors focus:border-zinc-400" placeholder="제목" value={title} onChange={e=>setTitle(e.target.value.slice(0,80))}/>
          <textarea className="w-full min-h-24 resize-y rounded-lg bg-transparent p-3 outline-none border border-[color:var(--line)] placeholder-[color:var(--muted)] transition-colors focus:border-zinc-400" placeholder="무슨 일이 일어나고 있나요?" value={body} onChange={e=>setBody(e.target.value.slice(0,400))}/>
          {img && <img src={img} className="mt-2 rounded-lg border border-[color:var(--line)] max-h-72 object-cover animate-ink"/>}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {tags.map(t=> <span key={t} className="chip me-1 mb-1" onClick={()=>setTags(tags.filter(x=>x!==t))}>#{t} ✕</span>)}
            <div className="relative">
              <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="#태그추가" className="rounded-lg px-2 py-1 bg-transparent border border-[color:var(--line)] outline-none"/>
              {draft && suggestList.length>0 && (
                <div className="absolute z-20 mt-1 card text-sm p-1 w-44 max-h-40 overflow-auto animate-fadeslide">
                  {suggestList.map(([t,c])=>(
                    <button key={t} className="w-full text-left px-2 py-1 hover:bg-black/5 rounded" onClick={()=>addTag(t)}>#{t} <span className="text-[10px] text-[color:var(--muted)]">×{c}</span></button>
                  ))}
                </div>
              )}
            </div>
            <button className="text-xs text-[color:var(--muted)]" onClick={()=>addTag(draft)}>추가</button>
            <label className="ms-auto text-xs cursor-pointer text-[color:var(--muted)] hover:underline"><input type="file" accept="image/*" className="hidden" onChange={onFile}/>이미지</label>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button className="btn-sub" onClick={()=>{setTitle('');setBody('');setImg(null);setTags([])}}>지우기</button>
            <button className="btn" onClick={()=>onPost({title,body,tags,image:img})}>게시</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PostCard=({post,me,actions,following})=>{
  const liked=post.likedBy.includes(me); const bm=post.bookmarkedBy.includes(me);
  return (
    <article className="card overflow-hidden press-3d">
      <div className="relative p-4">
        <Smudge className="absolute -top-10 -right-6 w-40 animate-float pointer-events-none"/>
        <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
          <div className="h-8 w-8 rounded-full bg-[var(--paper)] border border-[color:var(--line)] flex items-center justify-center">{post.author[0]}</div>
          <span>{post.author}</span><span>· {new Date(post.ts).toLocaleString()}</span>
        </div>
        <h3 className="mt-2 font-semibold">{post.title||'(제목 없음)'}</h3>
        <p className="mt-1 leading-relaxed line-clamp-4">{post.body}</p>
        {post.image && <img src={post.image} className="mt-3 rounded-xl border border-[color:var(--line)] max-h-96 object-cover w-full animate-ink"/>}
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map(t=> <TagChip key={t} tag={t} onClick={()=>actions.toggleTag(t)} following={following}/>)}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[color:var(--line)] px-3 py-2 text-sm text-[color:var(--muted)]">
        <div className="flex gap-4 items-center">
          <button onClick={()=>actions.like(post.id)} className={"transition " + (liked?'text-zinc-900 dark:text-white':'')}>{liked?'♥':'♡'} {post.likes}</button>
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

function App(){
  const [nick,setNick]=React.useState(Users.current()||Users.random());
  const [posts,setPosts]=React.useState(Store.load(Store.DB,[]));
  const [search,setSearch]=React.useState('');
  const [mode,setMode]=React.useState('feed');
  const [visible,setVisible]=React.useState(8);
  const [isDark,setDark]=React.useState(document.documentElement.classList.contains('dark'));
  const [toasts,setToasts]=React.useState([]); const [unread,setUnread]=React.useState(0); const [toastsOpen,setToastsOpen]=React.useState(true);
  const [selectedTags,setSelectedTags]=React.useState([]);
  React.useEffect(()=>Users.set(nick),[nick]);
  React.useEffect(()=>Store.save(Store.DB,posts),[posts]);

  React.useEffect(()=>{ if(posts.length===0){ setPosts([{id:uid(),title:'종이에 번지는 공지',body:'잉크는 말수가 적고, 대신 오래 남아.',tags:['공지','업데이트'],author:'시스템',ts:Date.now()-800000,likes:3,likedBy:[],bookmarkedBy:[],image:null,comments:[],reports:0}]) } },[]);
  React.useEffect(()=>{ const f=()=>{ if((window.innerHeight+window.scrollY)>=document.body.offsetHeight-200){ setVisible(v=>Math.min(v+6, filtered().length)) } }; window.addEventListener('scroll',f); return()=>window.removeEventListener('scroll',f) },[posts,search,mode,selectedTags]);

  const toggleDark=()=>{document.documentElement.classList.toggle('dark'); setDark(d=>!d)};
  const pushToast=(m)=>{setToasts(t=>[...t,{id:uid(),m}]); setUnread(u=>u+1)};

  const onPost=({title,body,tags,image})=>{ const p={id:uid(),title,body,tags,author:nick,ts:Date.now(),likes:0,likedBy:[],bookmarkedBy:[],image,comments:[],reports:0}; setPosts([p,...posts]); pushToast('새 글: '+(title||'제목 없음')); window.scrollTo({top:0,behavior:'smooth'}) };
  const like=id=>setPosts(ps=>ps.map(p=>p.id===id?{...p,likedBy:p.likedBy.includes(nick)?p.likedBy.filter(u=>u!==nick):[...p.likedBy,nick],likes:p.likedBy.includes(nick)?Math.max(0,p.likes-1):p.likes+1}:p));
  const bookmark=id=>setPosts(ps=>ps.map(p=>p.id===id?{...p,bookmarkedBy:p.bookmarkedBy.includes(nick)?p.bookmarkedBy.filter(u=>u!==nick):[...p.bookmarkedBy,nick]}:p));
  const report=id=>setPosts(ps=>ps.map(p=>p.id===id?{...p,reports:(p.reports||0)+1}:p));
  const del=id=>setPosts(ps=>ps.filter(p=>p.id!==id));
  const toggleTag=t=> setSelectedTags(arr=> arr.includes(t)? arr.filter(x=>x!==t): [...arr,t]);

  function filtered(){
    let list=posts.slice();
    if(mode==='tags'){ const target = selectedTags.length? selectedTags : []; if(target.length){ list=list.filter(p=> p.tags.some(t=> target.includes(t))) } }
    if(search.trim()){ const k=search.toLowerCase(); list=list.filter(p=> [p.title,p.body,p.author,...p.tags].join(' ').toLowerCase().includes(k)) }
    return list;
  }
  const list=filtered(); const tagIndex=TagKit.index(posts); const followed=TagKit.followed();
  const followTag=t=>{ const f=TagKit.toggleFollow(t); pushToast(`#${t} 팔로우 ${f.includes(t)?'ON':'OFF'}`) };

  return (
    <div>
      <Header nick={nick} onSearch={setSearch} mode={mode} setMode={setMode}
        toggleDark={toggleDark} isDark={isDark}
        unread={unread} toastsOpen={toastsOpen} setToastsOpen={setToastsOpen}
        selectedTags={selectedTags} clearTags={()=>setSelectedTags([])}
      />

      <main className="mx-auto max-w-[1200px] px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="hidden lg:block col-span-3 space-y-4 sticky top-20 h-fit">
          <div className="card p-4 animate-fadeslide">
            <div className="text-sm text-[color:var(--muted)] mb-2">안녕, {nick}</div>
            <button className="btn w-full" onClick={()=>document.getElementById('composer-anchor').scrollIntoView({behavior:'smooth'})}>지금 쓰기</button>
            <button className="btn-sub w-full mt-2" onClick={()=>setNick(nick=>nick || '게스트')}>세션 고정</button>
          </div>

          <div className="card p-4">
            <div className="font-semibold mb-2">트렌딩 태그</div>
            <div>{tagIndex.slice(0,20).map(([t,c])=>(<TagChip key={t} tag={t} count={c} onClick={()=>toggleTag(t)} following={followed} onFollow={followTag}/>))}</div>
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-6 space-y-5">
          <div id="composer-anchor"></div>
          <Composer nick={nick} onPost={onPost} tagIndex={tagIndex}/>
          {list.length===0 && <div className="text-center text-[color:var(--muted)]">결과가 없어요.</div>}
          <div className="space-y-5">
            {list.slice(0,visible).map(p=> <PostCard key={p.id} post={p} me={nick} actions={{like,bookmark,report,del,toggleTag}} following={followed}/>)}
          </div>
          {visible<list.length && <div className="text-center text-[color:var(--muted)]">스크롤하면 더 불러와요…</div>}
        </section>

        <aside className="hidden md:block col-span-3 space-y-4">
          <div className="card p-4 relative overflow-hidden">
            <Smudge className="absolute -top-10 -left-6 w-40"/><div className="font-semibold">노트</div>
            <p className="text-sm text-[color:var(--muted)] mt-1">태그 팔로우/자동완성/선택 필터 지원.</p>
          </div>
          <div className="card p-4">
            <div className="font-semibold mb-2">팔로우한 태그</div>
            <div>{followed.map(t=><TagChip key={t} tag={t} active onClick={()=>toggleTag(t)} following={followed} onFollow={followTag}/>)}</div>
          </div>
        </aside>
      </main>

      <footer className="mx-auto max-w-[1200px] px-4 py-10 text-center text-xs text-[color:var(--muted)]">© {new Date().getFullYear()} OVRA · tailwind+</footer>

      <div className="fixed bottom-4 end-4 flex flex-col gap-2 z-50">{toasts.slice(-5).map(t=><Toast key={t.id} msg={t.m}/>)}</div>
      <div className="pointer-events-none fixed end-2 top-24 w-28 opacity-50"><InkCat mood={1} alpha={.18}/></div>
      <div className="pointer-events-none fixed start-0 bottom-10 w-40 opacity-40"><InkCat mood={3} alpha={.12}/></div>
    </div>
  );
}
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
