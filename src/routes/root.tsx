import {
  Outlet,
  Link,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { useEffect } from "react";
// import { getContacts, createContact } from "../contacts";

// export async function action() {
//   const contact = await createContact();
//   return redirect(`/contacts/${contact.id}/edit`);
// }

// export async function loader({ request }) {
//   const contacts = await getContacts();
//   return { contacts };
// }

export default function Root() {
  // const { contacts } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  return (
    <>
      <div id="sidebar">
        <h1>ActivityStar Reference Client</h1>
        <nav>
          <ul>
            <li>
              <NavLink
                to={`feed`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "active"
                    : isPending
                    ? "pending"
                    : ""
                }
              >
                Feed
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`post`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "active"
                    : isPending
                    ? "pending"
                    : ""
                }
              >
                Make a Post!
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`identities`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "active"
                    : isPending
                    ? "pending"
                    : ""
                }
              >
                List known identities
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`following`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "active"
                    : isPending
                    ? "pending"
                    : ""
                }
              >
                Following
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`switch-identities`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "active"
                    : isPending
                    ? "pending"
                    : ""
                }
              >
                Switch Identity
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div
        id="detail"
        className={
          navigation.state === "loading" ? "loading" : ""
        }
      >
        <Outlet />
      </div>
    </>
  );
}
