/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { Network } from '@thorswap-lib/types';

interface ImportMetaEnv {
  readonly VITE_NETWORK?: Network;
  readonly VITE_MAINNET_MIDGARD: string;
  readonly VITE_MAINNET_THORNODE: string;
  readonly VITE_MAINNET_THORCHAIN_RPC: string;
  readonly VITE_DOGENODE_API_KEY: string;
  readonly VITE_ETHERSCAN_API_KEY: string;
  readonly VITE_ETHPLORER_API_KEY: string;
  readonly VITE_INFURA_PROJECT_ID: string;
  readonly VITE_INFURA_PROJECT_ID: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_IS_NETWORK_ONLINE: string;
  readonly VITE_RPC_URL: string;
  readonly VITE_BLOCKNATIVE_API_KEY: string;
  readonly VITE_ETHEREUM_NETWORK_ID: string;
  readonly VITE_PORTIS_API_KEY: string;
  readonly VITE_FORTMATIC_API_KEY: string;
  readonly VITE_FIGMENT_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
