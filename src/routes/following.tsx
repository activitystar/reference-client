import {
  useLoaderData,
  Form,
  useFetcher,
} from "react-router-dom";
import { getClient } from "../store";

export async function loader({ params }) {
  const identities = await getClient().getFollowing();
  return { identities };
}

export default function Following() {
  const { identities } = useLoaderData();

  return (
    <ul id="feed">
      {identities.map((identity) => (
        <li key={identity}>
          <p>
            {identity}
          </p>
        </li>
      ))}
    </ul>
  );
}
