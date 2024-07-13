import { Path } from "@earthstar/earthstar";

export class DidCinn25519Driver {
  constructor(store) {
    // used by did-io to register drivers
    this.method = 'cinn25519';
    this.store = store;
  }

  /**
   * Returns a `did:key` method DID Document for a given DID, or a key document
   * for a given DID URL (key id).
   * Either a `did` or `url` param is required.
   *
   * @example
   * await resolver.get({did}); // -> did document
   * await resolver.get({url: keyId}); // -> public key node
   *
   * @param {object} options - Options hashmap.
   * @param {string} [options.did] - DID URL or a key id (either an ed25519 key
   *   or an x25519 key-agreement key id).
   * @param {string} [options.url] - Alias for the `did` url param, supported
   *   for better readability of invoking code.
   *
   * @returns {Promise<object>} Resolves to a DID Document.
   */
  async get({did, url} = {}) {
    did = did || url;
    if(!did) {
      throw new TypeError('"did" must be a string.');
    }
    const identityTag = did.substring('did:cinn25519:'.length);

    const esDocument = await this.store.get(
      `@${identityTag}`,
      Path.fromStrings("about", "did.json")
    )
    if (!esDocument) {
      throw new Error("Couldn't find DID document")
    }
    const didDocument = JSON.parse(await esDocument.payload.bytes())

    // Resolve the full DID Document
    return didDocument;
  }
}

export function driver(store) {
  return new DidCinn25519Driver(store);
}
