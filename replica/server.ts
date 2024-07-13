import {
	getStorageDriverFilesystem,
	ExtensionSyncWebsocket,
	RuntimeDriverDeno,
	Server,
} from "@earthstar/earthstar/deno";
import {
	Peer,
	StorageDriverMemory,
} from "@earthstar/earthstar";
import * as path from 'https://deno.land/std@0.102.0/path/mod.ts';

import { knownPublicKeypair, socialNamespace } from '../src/constants.ts'
import { encodeBase32 } from '../src/base32.ts'

export const mainModuleDir = path.dirname(path.fromFileUrl(Deno.mainModule));

Deno.chdir(mainModuleDir);

const peer = new Peer({
	password: "",
	runtime: new RuntimeDriverDeno(),
	storage: await getStorageDriverFilesystem('./data'),
	// storage: new StorageDriverMemory(),
})

const server = new Server(
	[
		new ExtensionSyncWebsocket("sync"),
	],
	{
		peer: peer,
		port: 7123,
	},
)

for await (const obj of peer.auth.shareKeypairs()) {
	console.log(obj)
}
console.log(await peer.addExistingShare(socialNamespace))
for await (const obj of peer.auth.shareKeypairs()) {
	console.log(obj)
}

// const johnKeypair = await peer.createIdentity("john") as IdentityKeypair;
const johnKeypair = {
	tag: "@john.bz5ay3nkxqrupfhuu3og5qhpnckvbed5enqukga6hxtsqsobmkmpa",
	// 🔑john.bz6lysiricoode7gqknvyn7pijnd7724qmb63k7bqs45vc5gxir5q
	secretKey: "bz6lysiricoode7gqknvyn7pijnd7724qmb63k7bqs45vc5gxir5q"
  // secretKey: new Uint8Array([
  //   207, 151, 137,  34,  40,  19, 156,  50,
  //   124, 208,  83, 107, 134, 253, 232,  75,
  //    71, 255, 235, 144,  96, 125, 181, 124,
  //    48, 151,  59,  81, 116, 215,  68, 123
  // ]),
}
console.log(await peer.addExistingIdentity(johnKeypair))
for await (const obj of peer.auth.identityKeypairs()) {
	console.log(obj)
}


console.log(johnKeypair)
const johnWriteCap = await peer.mintCap(
	socialNamespace,
	johnKeypair.tag,
	"write",
)
console.log(johnWriteCap)
const johnReadCap = await peer.mintCap(
	socialNamespace,
	johnKeypair.tag,
	"read",
)
console.log(johnReadCap)
// const publicReadCap = await johnReadCap.delegate(knownPublicKeypair.tag)
// console.log(publicReadCap)
// console.log(encodeBase32(publicReadCap.export()))
// baaaxg33dnfqwyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabvg62doz5ay3nkxqrupfhuu3og5qhpnckvbed5enqukga6hxtsqsobmkmpgaaaaabxxazlohnvcppgow2sc2yvdvdicu3ynonsteflxdxrehjr2ybekdc2z3iu2nbpgea5laaqfjq4r26elj446kk7zmgwd3pa4uy5fspo4bn4ix35s7yx3g6hgkemlrou5tm4zb46mtnmsqmfy45gijiyrdcnhkn6zaa

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

const store = await peer.getStore(socialNamespace)
console.log(store)

console.log('Documents in social store:')
for await (const doc of store.documents()) {
	console.log(doc)
	console.log(await doc.payload.bytes())
}

console.log('Interests:', await peer.auth.interestsFromCaps())

setInterval(async function() {
	console.log('Documents in social store:')
	for await (const doc of store.documents()) {
		console.log(doc)
		console.log(await doc.payload.bytes())
	}
}, 5000)
