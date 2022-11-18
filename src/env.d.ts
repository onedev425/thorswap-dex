/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_THORSWAP_API: string;
  readonly VITE_MAINNET_MIDGARD: string;
  readonly VITE_MAINNET_THORNODE: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_ALCHEMY_KEY: string;
  readonly VITE_COVALENT_API_KEY: string;
  readonly VITE_DOGENODE_API_KEY: string;
  readonly VITE_ETHERSCAN_API_KEY: string;
  readonly VITE_ETHPLORER_API_KEY: string;
  readonly VITE_KADO_KEY: string;
  readonly VITE_BLOCKCHAIR_API_KEY: string;
  readonly VITE_USING_FALLBACK_MIDGARD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
