import { useEffect, useState } from 'npm:react'
import { BrowserRouter as Router, Link, Route, Switch } from 'npm:react-router-dom';
// import './App.css'

// import * as Earthstar from "https://cdn.earthstar-project.org/js/earthstar.web.v10.2.2.js";
// import { useReplica } from './stuff.tsx';

import { Store } from './earthstar/src/store/store.ts';

import { resolver } from './did.ts';

const MY_SHARE_ADDRESS = "+chatting.brecxrrtltiwbk2bdeh3ct3ca76f4goe2w55chxwenauceu6666yq";

const MY_SHARE_SECRET = "beitsf4rc75qypiea3udhulnwxa5ojzuagzvk43qud5amem7pgvaq";

// const replica = new Earthstar.Replica({
//   driver: new Earthstar.ReplicaDriverWeb(MY_SHARE_ADDRESS),
//   shareSecret: MY_SHARE_SECRET,
// });

// const peer = new Earthstar.Peer();
// peer.addReplica(replica);
// peer.sync("http://localhost:8000", true);

function App() {
  const [count, setCount] = useState(0);
  // const cache = useReplica(replica);
  const store = new Store("+social.00000000000000000000000000000000000000000000000000000");

  // This will update whenever a document with a path starting with '/notes' updates.
  // const notes = cache.queryDocs({
  //   filter: {
  //     pathStartsWith: "/chat",
  //   },
  // });

  const [data, updateData] = useState();
  useEffect(() => {
    const getData = async () => {
      const resp = await resolver.get({did: 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'});
      updateData(resp);
    }
    getData();
  }, []);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/about" component={About} />
        <Route path="/products" component={Products} />
        <Route path="/contact" component={Contact} /> */}
      </Switch>
    </Router>
  );

  return (
    <>
      <div>
        <h1>My notes</h1>
        { notes.map((noteDoc) =>
          <li>{noteDoc.text}</li>
        )}
      </div>
      <div>
        <p>
          {JSON.stringify(data)}
        </p>
      </div>
    </>
  )
}

export default App
