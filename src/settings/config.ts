// biome-ignore lint/style/useDefaultParameterLast: <explanation>
const isEnv = (env = "", urlMatch: string) => {
  const envValue = import.meta.env[env] || process.env[env];

  return envValue === "true" || window.location.href.includes(urlMatch);
};

export const IS_LOCAL = import.meta.env.MODE === "development";

export const IS_DEV_API =
  isEnv("VITE_DEV_API", "dev") || isEnv("VITE_DEV_API", '"-thorswap.vercel.app"');
export const IS_STAGENET = isEnv("VITE_STAGENET", "stagenet");
export const IS_BETA = isEnv("VITE_BETA", "beta");
export const IS_LEDGER_LIVE = isEnv("VITE_LEDGER_LIVE", "ledgerlive");
export const IS_PROD = isEnv("VITE_PROD", "app.thorswap.finance");

/**
 * Used for protected deployments under password
 */
export const IS_PROTECTED = IS_BETA || IS_LOCAL || IS_DEV_API;

export const THORNODE_URL = IS_STAGENET
  ? "https://stagenet-thornode.ninerealms.com/thorchain"
  : "https://thornode.thorswap.net/thorchain";

const MIDGARD_DEV_API = "https://midgard-stage-a.thorswap.net";
const MIDGARD_MAINNET_API = "https://midgard.thorswap.net";
const MIDGARD_STAGENET_API = "https://stagenet-midgard.ninerealms.com";

export const MIDGARD_URL = IS_DEV_API
  ? MIDGARD_DEV_API
  : IS_STAGENET
    ? MIDGARD_STAGENET_API
    : MIDGARD_MAINNET_API;

export const TEST_ENVIRONMENT_NAME = IS_BETA
  ? "BETA"
  : IS_STAGENET
    ? "STAGENET"
    : IS_DEV_API
      ? "DEV"
      : IS_LOCAL
        ? "LOCAL"
        : "TEST";
