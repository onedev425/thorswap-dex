/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { Network } from '@thorswap-lib/types';

interface ImportMetaEnv {
  readonly VITE_NETWORK: Network;
  readonly VITE_THORSWAP_API: string;
  readonly VITE_THORSWAP_STATIC_API: string;
  readonly VITE_MAINNET_MIDGARD: string;
  readonly VITE_MAINNET_THORNODE: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_ALCHEMY_KEY: string;
  readonly VITE_DOGENODE_API_KEY: string;
  readonly VITE_ETHERSCAN_API_KEY: string;
  readonly VITE_ETHPLORER_API_KEY: string;
  readonly VITE_FIGMENT_API_KEY: string;

  VITE_STAGENET?: string;
  VITE_TESTNET?: string;
  VITE_DEV_API?: string;
  VITE_BETA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
