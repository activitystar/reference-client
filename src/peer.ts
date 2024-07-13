import { isErr, Peer, RuntimeDriverUniversal, StorageDriverMemory } from "@earthstar/earthstar";

import { knownPublicKeypair } from "./constants.ts";

export const peer = new Peer({
  password: "",
  runtime: new RuntimeDriverUniversal(),
  storage: new StorageDriverMemory(),
});

const addKnownPublicIdentityResult = await peer.addExistingIdentity(knownPublicKeypair)
if (isErr(addKnownPublicIdentityResult)) {
  throw new Error(addKnownPublicIdentityResult)
}

// Hacky dev stuff

import { decodeBase32 } from './base32.ts'
import { delay } from "@std/async";

console.log(await peer.importCap(decodeBase32("baaaxg33dnfqwyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabvg62doz5ay3nkxqrupfhuu3og5qhpnckvbed5enqukga6hxtsqsobmkmpgaaaaabxxazlohnvcppgow2sc2yvdvdicu3ynonsteflxdxrehjr2ybekdc2z3iu2nbpgea5laaqfjq4r26elj446kk7zmgwd3pa4uy5fspo4bn4ix35s7yx3g6hgkemlrou5tm4zb46mtnmsqmfy45gijiyrdcnhkn6zaa")))

let syncer

// Needs to happen after caps
// Get restarted on every cap change in future?
// Also it doesn't pick up on new payloads etc..
setInterval(async function() {
  console.log('Known keypairs:')
  for await (const keypair of peer.auth.identityKeypairs()) {
    console.log(keypair)
  }

  console.log('Known shares:', await peer.shares())

  console.log('Write caps:')
  for await (const cap of peer.getWriteCaps()) {
    console.log(cap.share, cap.receiver)
  }
  console.log('Read caps:')
  for await (const cap of peer.getReadCaps()) {
    console.log(cap.share, cap.receiver)
  }

  const store = await peer.getStore("+social.baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

  console.log('Documents in social store:')
  for await (const doc of store.documents()) {
    console.log(doc)
    console.log(await doc.payload.bytes())
  }

  console.log('Interests:', await peer.auth.interestsFromCaps())
  syncer = await peer.syncHttp(`ws://localhost:7123/sync`)
  await delay(10000)
  await syncer.close()
}, 15000)
