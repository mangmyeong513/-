import {Store, TagKit} from './store.js';
import {Users} from './users.js';
import {InkCat, Smudge} from './components.js';

const uid = Store.uid;

// ------------------ 단일 포스트 카드 ------------------
const PostCard = ({post, me, onLike, onBookmark, onOpen}) => (
  <article className="card p-4 animate-fadeslide press-3d">
    <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
      <div className="h-8 w-8 rounded-full border flex items-center justify-center">{post.author[0]}</div>
      <span className="font-medium">{post.author}</span>
      <span className="ms-2">{new Date(post.ts).toLocaleString()}</span>
    </div>
    <h3 className="mt-2 font-semibold">{post.title}</h3>
    <p className="mt-1 line-clamp-3">{post.body}</p>
    <div className="mt-2 flex gap-2 flex-wrap">
      {post.tags.map(t => (
        <span key={t} className="chip">#{t}</span>
      ))}
    </div>
    <div className="mt-3 flex justify-between text-sm text-[color:var(--muted)]">
      <button onClick={()=>onLike(post.id)}>{post.likedBy.includes(me) ? '♥' : '♡'} {post.likes}</button>
      <button onClick={()=>onBookmark(post.id)}>{post.bookmarkedBy.includes(me) ? '🔖 해제' : '🔖 북마크'}</button>
      <button onClick={()=>onOpen(post)}>상세</button>
    </div>
  </article>
);

// ------------------ 작성창 ------------------
const Composer = ({nick,onPost})=>{
  const [title,setTitle]=React.useState('');
  const [body,setBody]=React.useState('');
  const [tags,setTags]=React.useState([]);
  const [tagInput,setTagInput]=React.useState('');

  React.useEffect(()=>{ setTags(TagKit.suggest(title,body)); },[title,body]);

  const submit=()=>{
    if(!title && !body) return;
    onPost({id:uid(), title, body, tags, author:nick, ts:Date.now(), likes:0, likedBy:[], bookmarkedBy:[], tags});
    setTitle(''); setBody(''); setTags([]);
  };

  return (
    <div className="card p-4">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="제목" className="w-full mb-2 border rounded px-2 py-1"/>
      <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="내용" className="w-full border rounded px-2 py-1"/>
      <div className="mt-2 flex gap-2 flex-wrap">
        {tags.map(t=> <span key={t} className="chip">#{t}</span>)}
        <input value={tagInput} onChange={e=>setTagInput(e.target.value)} placeholder="#태그추가" className="border rounded px-2"/>
        <button className="btn-sub" onClick={()=>{ if(tagInput){setTags([...tags,tagInput]); setTagInput('')} }}>추가</button>
      </div>
      <div className="mt-3 text-right"><button className="btn" onClick={submit}>게시</button></div>
    </div>
  );
};

// ------------------ 메인 앱 ------------------
function App(){
  const [nick,setNick]=React.useState(Users.current()||Users.random());
  const [posts,setPosts]=React.useState(Store.load(Store.DB,[]));
  const [mode,setMode]=React.useState('feed'); // feed | bookmarks | tags
  const [search,setSearch]=React.useState('');
  const [dark,setDark]=React.useState(false);

  React.useEffect(()=>Users.set(nick),[nick]);
  React.useEffect(()=>Store.save(Store.DB,posts),[posts]);

  const onPost=(p)=>setPosts([p,...posts]);
  const onLike=(id)=>setPosts(ps=>ps.map(p=>p.id===id ? {...p, likedBy:p.likedBy.includes(nick)? p.likedBy.filter(x=>x!==nick) : [...p.likedBy,nick], likes:p.likedBy.includes(nick)? p.likes-1:p.likes+1} : p));
  const onBookmark=(id)=>setPosts(ps=>ps.map(p=>p.id===id ? {...p, bookmarkedBy:p.bookmarkedBy.includes(nick)? p.bookmarkedBy.filter(x=>x!==nick):[...p.bookmarkedBy,nick]} : p));

  let list=posts;
  if(mode==='bookmarks') list=list.filter(p=>p.bookmarkedBy.includes(nick));
  if(search.trim()) list=list.filter(p=>[p.title,p.body,...p.tags].join(' ').includes(search));

  return (
    <div className={dark?'dark':''}>
      <header className="sticky top-0 bg-[var(--paper)]/80 backdrop-blur border-b flex justify-between p-3">
        <nav className="flex gap-4 text-sm">
          <button onClick={()=>setMode('feed')} className={mode==='feed'?'font-bold':''}>피드</button>
          <button onClick={()=>setMode('bookmarks')} className={mode==='bookmarks'?'font-bold':''}>북마크</button>
          <button onClick={()=>setMode('tags')} className={mode==='tags'?'font-bold':''}>태그</button>
        </nav>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="검색…" className="border rounded px-2"/>
        <button onClick={()=>setDark(d=>!d)} className="btn-sub">{dark?'☀️':'🌙'}</button>
      </header>

      <main className="mx-auto max-w-2xl p-4 space-y-4">
        <Composer nick={nick} onPost={onPost}/>
        {mode==='tags' ? (
          <div className="card p-4">
            <h2 className="font-bold mb-2">트렌딩 태그</h2>
            {TagKit.index(posts).map(([tag,count])=>(
              <div key={tag} className="flex justify-between">
                <span>#{tag}</span><span>{count}</span>
              </div>
            ))}
          </div>
        ) : (
          list.map(p=><PostCard key={p.id} post={p} me={nick} onLike={onLike} onBookmark={onBookmark} onOpen={()=>{}}/>)
        )}
      </main>
    </div>
  );
}

const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
