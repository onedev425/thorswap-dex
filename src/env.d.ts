/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_BLOCKCHAIR_API_KEY: string;
  readonly VITE_COVALENT_API_KEY: string;
  readonly VITE_ETHPLORER_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
