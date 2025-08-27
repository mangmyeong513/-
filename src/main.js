import {Store} from './store.js';
import {Users} from './users.js';
import {InkCat, Smudge} from './components.js';

function App(){
  const [nick,setNick]=React.useState(Users.current()||Users.random());
  const [posts,setPosts]=React.useState(Store.load(Store.DB,[]));
  React.useEffect(()=>Users.set(nick),[nick]);
  React.useEffect(()=>Store.save(Store.DB,posts),[posts]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">OVRA</h1>
      <button onClick={()=>setNick(Users.random())} className="btn-sub">닉네임 변경</button>
      <div className="mt-4 space-y-4">
        {posts.map(p=><div key={p.id} className="card p-4">{p.body}</div>)}
      </div>
    </div>
  );
}

const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
