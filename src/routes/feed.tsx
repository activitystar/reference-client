import {
  useLoaderData,
  Form,
  useFetcher,
} from "react-router-dom";
import { getClient } from "../store";

import { useContext } from "react";
import { Link } from "../../.vite/deps_temp_bb88f200/react-router-dom.js";

export async function loader({ params }) {
  const activities = await getClient().getActivities();
  return { activities };
}

export default function Feed() {
  const { activities } = useLoaderData();

  return (
    <ul id="feed">
      {activities.map((activity) => (
        <li key={activity.path}>
          <p>
            {activity.identity}: {activity.path}: {activity.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
