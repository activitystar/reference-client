import * as ed from "https://esm.sh/@noble/ed25519@2.0.0";

import { ActivityStar } from "./activitystar.ts";
import { peer } from './peer.ts'
import { decodeBase32, encodeBase32 } from './base32.ts';

let client: ActivityStar;

export async function setIdentity(encodedIdentity: string) {
  const [shortname, privateKeyBase32] = encodedIdentity.substring(2).split('.')
  const privateKey = decodeBase32(privateKeyBase32);
  const publicKey = await ed.getPublicKeyAsync(privateKey);
  const identity = {
    tag: `@${shortname}.${encodeBase32(publicKey)}`,
    secretKey: privateKeyBase32,
  }

  client = await ActivityStar.create({
    peer: peer,
    identityKeypair: identity,
  })

  return client
}

client = await ActivityStar.create({
  peer: peer,
  identityKeypair: await peer.createIdentity(
    "suzy",
  ),
})

export function getClient() {
  return client
}

// Testing
console.log(await client.createNote(
  "public",
  "Hello world!",
))
console.log(await client.followIdentity(
  "did:web:mikebryant.me.uk"
))
