import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import ErrorPage from "./error-page";
import Root, {
  // loader as rootLoader,
  // action as rootAction,
} from "./routes/root";
import Feed, {
  loader as feedLoader,
} from "./routes/feed";
import Following, {
  loader as followingLoader,
} from "./routes/following";
import Identities, {
  loader as identitiesLoader,
} from "./routes/identities";
import SwitchIdentity, {
  loader as switchIdentityLoader,
  action as switchIdentityAction,
} from "./routes/switch-identities.tsx";
import CreatePost, {
  action as createPostAction,
} from "./routes/post.tsx";
// import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";

import { StoreContext } from "./store.ts";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      // loader={rootLoader}
      // action={rootAction}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        <Route
          path="feed"
          element={<Feed />}
          loader={feedLoader}
        />
        <Route
          path="following"
          element={<Following />}
          loader={followingLoader}
        />
        <Route
          path="identities"
          element={<Identities />}
          loader={identitiesLoader}
        />
        <Route
          path="post"
          element={<CreatePost />}
          action={createPostAction}
        />
        <Route
          path="switch-identities"
          element={<SwitchIdentity />}
          action={switchIdentityAction}
          loader={switchIdentityLoader}
        />
        {/* <Route
          errorElement={<div>Oops! There was an error.</div>}
          path="contacts/:contactId/destroy"
          action={destroyAction}
        /> */}
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
