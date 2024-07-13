import { dump, load } from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.mjs';
import { resolver } from './did.ts';
import { isErr, IdentityKeypair, IdentityTag, Path, Peer, Store } from "@earthstar/earthstar";
import { knownPublicKeypair, socialNamespace } from './constants.ts'


export class ActivityStar {
  public peer: Peer
  private store: Store
  public identityTag: IdentityTag

  private constructor({
    peer,
    identityTag,
    store,
  }) {
    this.peer = peer
    this.identityTag = identityTag
    this.store = store
  }

  public static async create({
    peer,
    identityKeypair,
  }: {
    identityKeypair: IdentityKeypair
    peer: typeof Peer
  }) {
    const addKnownPublicIdentityResult = await peer.addExistingIdentity(knownPublicKeypair)
    if (isErr(addKnownPublicIdentityResult)) {
      throw new Error(addKnownPublicIdentityResult)
    }

    const addIdentityResult = await peer.addExistingIdentity(identityKeypair)
    if (isErr(addIdentityResult)) {
      throw new Error(addIdentityResult)
    }

    console.log(socialNamespace)
    console.log(typeof socialNamespace)

    const addExistingShareResult = await peer.addExistingShare(socialNamespace)
    if (isErr(addExistingShareResult)) {
      throw new Error(addExistingShareResult)
    }

    const cap = await peer.mintCap(
      socialNamespace,
      identityKeypair.tag,
      "write",
    )
    if (isErr(cap)) {
      throw new Error(cap)
    }

    const store = await peer.getStore(socialNamespace)
    if (isErr(store)) {
      throw new Error(store)
    }

    const as = new ActivityStar({
      peer,
      identityTag: identityKeypair.tag,
      store,
    })

    return as
  }

  public async getActivities() {

    const activities = [];

    for await (const activityDoc of this.store.queryDocs({
      descending: true,
      limit: 10,
      pathPrefix: Path.fromStrings("social", "feed"),
      order: "timestamp",
    })) {
      console.log(activityDoc)
      console.log(activityDoc.path.format('base32'))
      console.log(activityDoc.path.format('ascii'))

      activities.push({
        identity: activityDoc.identity,
        path: activityDoc.path.format('ascii'),
        text: new TextDecoder().decode(await activityDoc.payload.bytes()),
      })
    }

    return activities;
  }

  public async createNote(
    audience: "followers" | "public",
    content: string,
  ) {
    const document = {
      content: content,
      mediaType: "text/markdown",
      type: "Note",
    }

    console.log({
      identity: this.identityTag,
      path: Path.fromStrings("social", "feed", audience, `${Date.now().toString()}.yaml`),
      payload: new TextEncoder().encode(dump(document)),
    })

    const result = await this.store.set({
      identity: this.identityTag,
      path: Path.fromStrings("social", "feed", audience, `${Date.now().toString()}.yaml`),
      payload: new TextEncoder().encode(dump(document)),
    })

    if (result.kind != "success") {
      throw Error(result.message)
    }

    return result
  }

  public async getAllIdentities() {
    const identities = []

    for await (const didFile of this.store.documentsAtPath(Path.fromStrings("about", "did"))) {
      const did = await didFile.payload.bytes()
      try {
        const didDocument = await resolver.get({did})
        identities.push(didDocument)
      } catch (err) {
        console.log(`Failed to resolve did ${didFile}: ${err}`)
      }
    }

    // for await (const identity of this.store.queryIdentities({
    //   descending: true,
    //   limit: 100,
    //   pathPrefix: Path.fromStrings("social"),
    //   order: "timestamp",
    // })) {
    //   console.log(identity)
    //   identities.push(identity)
    // }
    return identities
  }

  public async followIdentity(did: string) {
    const result = await this.store.set({
      identity: this.identityTag,
      path: Path.fromStrings("social", "following", `${did}.yaml`),
      payload: new TextEncoder().encode(dump({
        did: did
      })),
    })

    if (result.kind != "success") {
      throw Error(result.message)
    }

    return result
  }

  public async getFollowing() {
    const identities = []

    for await (const followingDocument of this.store.queryDocs({
      pathPrefix: Path.fromStrings("social", "following"),
    })) {
      const payload = load(new TextDecoder().decode(await followingDocument.payload.bytes()))
      identities.push(payload.did)
    }
    return identities
  }

  public async earthstarIDToDID(identityTag: string) {
    return await resolver.get({did: `did:cinn25519:${identityTag.slice(1)}`})
  }

  public async DIDtoEarthstarID(did: string) {
    const didDocument = await resolver.get({did})

    for (const alsoKnownAsEntry of didDocument.alsoKnownAs) {
      if (alsoKnownAsEntry.startsWith('did:cinn25519:')) {
        return `@${did.substring('did:cinn25519:'.length)}`
      }
    }

    throw new Error('Failed to resolve did to identityTag')
  }

}
