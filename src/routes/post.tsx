import {
  Form,
  useLoaderData,
  redirect,
  useNavigate,
} from "react-router-dom";
import { getClient } from "../store";

export async function action({ request, params }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await getClient().createNote("public", data["text"]);
  return redirect("/feed");
}

export default function CreatePost() {
  const navigate = useNavigate();

  return (
    <Form method="post" id="create-post-form">
      <p>
        <span>Text</span>
        <input
          placeholder="Hello World!"
          aria-label="Text"
          type="text"
          name="text"
        />
      </p>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
