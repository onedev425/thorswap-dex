const isEnv = (env: string = '', urlMatch: string) =>
  env === 'true' || window.location.href.includes(urlMatch);

export const IS_DEV_API = isEnv(import.meta.env.VITE_DEV_API, 'dev');
export const IS_STAGENET = isEnv(import.meta.env.VITE_STAGENET, 'stagenet');
export const IS_BETA = isEnv(import.meta.env.VITE_BETA, 'beta');
export const IS_PROD = isEnv(import.meta.env.VITE_PROD, 'app.thorswap.finance');

export const MIDGARD_DEV_API = 'https://midgard-stage-a.thorswap.net';
export const STATIC_API = 'https://static.thorswap.net';

export const THORNODE_URL = `${
  import.meta.env.VITE_MAINNET_THORNODE || 'https://thornode.thorswap.net'
}/thorchain`;

const MIDGARD_STAGENET_API = 'https://stagenet-midgard.ninerealms.com';
const MIDGARD_MAINNET_API = import.meta.env.VITE_MAINNET_MIDGARD || 'https://midgard.thorswap.net';
export const MIDGARD_URL = IS_STAGENET ? MIDGARD_STAGENET_API : MIDGARD_MAINNET_API;

export const midgardAPIUrl = (url: string) => `${MIDGARD_URL}/v2/${url}`;
