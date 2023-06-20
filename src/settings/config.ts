const isEnv = (env: string = '', urlMatch: string) =>
  env === 'true' || window.location.href.includes(urlMatch);
export const IS_DEV_API = isEnv(import.meta.env.VITE_DEV_API, 'dev');
export const IS_LOCAL = import.meta.env.MODE === 'development';
export const IS_STAGENET = isEnv(import.meta.env.VITE_STAGENET, 'stagenet');
export const IS_BETA = isEnv(import.meta.env.VITE_BETA, 'beta');
export const IS_PROD = isEnv(import.meta.env.VITE_PROD, 'app.thorswap.finance');
export const THORNODE_URL = 'https://thornode.thorswap.net/thorchain';

const MIDGARD_DEV_API = 'https://midgard-stage-a.thorswap.net';
const MIDGARD_MAINNET_API = 'https://midgard.thorswap.net';
const MIDGARD_STAGENET_API = 'https://stagenet-midgard.ninerealms.com';

export const MIDGARD_URL = IS_DEV_API
  ? MIDGARD_DEV_API
  : IS_STAGENET
  ? MIDGARD_STAGENET_API
  : MIDGARD_MAINNET_API;

export const TEST_ENVIRONMENT_NAME = IS_BETA
  ? 'BETA'
  : IS_STAGENET
  ? 'STAGENET'
  : IS_DEV_API
  ? 'DEV'
  : IS_LOCAL
  ? 'LOCAL'
  : 'TEST';
