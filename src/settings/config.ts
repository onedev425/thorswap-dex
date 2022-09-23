import { Network } from '@thorswap-lib/types';

const isEnv = (env: string, urlMatch: string) =>
  env === 'true' || window.location.href.includes(urlMatch);

export const IS_DEV_API = isEnv(import.meta.env.VITE_DEV_API, 'dev');
export const IS_STAGENET = true; // isEnv(import.meta.env.VITE_STAGENET, 'stagenet');
export const IS_BETA = isEnv(import.meta.env.VITE_BETA, 'beta');
export const IS_PROD = isEnv(import.meta.env.VITE_PROD, 'app.thorswap.finance');
export const IS_TESTNET = isEnv(import.meta.env.VITE_TESTNET, 'testnet');

export const NETWORK = `${
  import.meta.env.VITE_NETWORK || (IS_TESTNET ? Network.Testnet : Network.Mainnet)
}` as Network;

export const IS_MAINNET = NETWORK === Network.Mainnet;

const MIDGARD_TESTNET_API = 'https://testnet.midgard.thorswap.net';
const MIDGARD_MAINNET_API = import.meta.env.VITE_MAINNET_MIDGARD || 'https://midgard.thorswap.net';
export const MIDGARD_DEV_API = 'https://midgard-stage-a.thorswap.net';
export const MIDGARD_STAGENET_API = 'https://stagenet-midgard.ninerealms.com';
export const STATIC_API = 'https://static.thorswap.net';

export const THORNODE_URL = `${
  import.meta.env.VITE_MAINNET_THORNODE || 'https://thornode.thorswap.net'
}/thorchain`;

export const THORNODE_API_URI = IS_TESTNET
  ? 'https://testnet.thornode.thorswap.net/thorchain'
  : THORNODE_URL;

export const midgardAPIUrl = (url: string) => `${MIDGARD_URL}/v2/${url}`;

export const MIDGARD_URL = IS_TESTNET
  ? MIDGARD_TESTNET_API
  : IS_STAGENET
  ? MIDGARD_STAGENET_API
  : IS_DEV_API
  ? MIDGARD_DEV_API
  : MIDGARD_MAINNET_API;
