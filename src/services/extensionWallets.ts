import {
  BraveClient,
  KeplrClient,
  MetaMaskClient,
  PhantomClient,
  XdefiClient,
} from '@thorswap-lib/multichain-web-extensions';
import { NETWORK } from 'settings/config';

export const keplr = new KeplrClient(NETWORK);

export const metamask = new MetaMaskClient(NETWORK);

export const phantom = new PhantomClient(NETWORK);

export const xdefi = new XdefiClient(NETWORK);

export const brave = new BraveClient(NETWORK);
