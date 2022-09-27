import {
  BraveClient,
  KeplrClient,
  MetaMaskClient,
  PhantomClient,
  XdefiClient,
} from '@thorswap-lib/multichain-web-extensions';
import { Network } from '@thorswap-lib/types';

export const keplr = new KeplrClient(Network.Mainnet);
export const metamask = new MetaMaskClient(Network.Mainnet);
export const phantom = new PhantomClient(Network.Mainnet);
export const xdefi = new XdefiClient(Network.Mainnet);
export const brave = new BraveClient(Network.Mainnet);
