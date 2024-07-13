import {CachedResolver} from '@digitalbazaar/did-io';
import * as didKey from '@digitalbazaar/did-method-key';
import * as Ed25519Multikey from '@digitalbazaar/ed25519-multikey';
import * as didWeb from '@digitalbazaar/did-method-web';
import * as didCinn25519 from './did-method-cinn25519.ts';

import { socialNamespace } from './constants.ts'
import { peer } from './peer.ts'

// You can pass cache options to the constructor (see Cache Management below)
export const resolver = new CachedResolver({max: 100}); // defaults to 100

const didKeyDriver = didKey.driver();
didKeyDriver.use({
  multibaseMultikeyHeader: 'z6Mk',
  fromMultibase: Ed25519Multikey.from
});

const didWebDriver = didWeb.driver();

const didCinn25519Driver = didCinn25519.driver(await peer.getStore(socialNamespace));

resolver.use(didKeyDriver);
resolver.use(didWebDriver);
resolver.use(didCinn25519Driver);
