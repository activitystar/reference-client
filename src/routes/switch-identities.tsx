import {
  useLoaderData,
  Form,
  useFetcher,
} from "react-router-dom";
import { getClient, setIdentity } from "../store.ts";

export async function action({ request, params }) {
  const formData = await request.formData();
  return setIdentity(formData.get("private-key"));
}

export async function loader({ params }) {
  const client = await getClient()
  const identityKeypair = await client.peer.getIdentityKeypair(client.identityTag)
  const publicAddress = client.identityTag

  const privateAddress = `🔑${client.identityTag.substring(1).split('.')[0]}.${identityKeypair.secretKey}`

  return { privateAddress, publicAddress };
}

export default function SwitchIdentity() {
  const { privateAddress, publicAddress } = useLoaderData();

  return (
    <Form method="post" id="identity-form">
      <p>
        <span>Private Identity</span>
        <input
          placeholder="@suzy.babcd..."
          aria-label="Private Key"
          type="text"
          name="private-key"
          defaultValue={privateAddress}
        />
        <span>Public Key</span>
        <b>{publicAddress}</b>
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
