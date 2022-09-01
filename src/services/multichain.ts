import { MultiChain, setGlobalConfig } from '@thorswap-lib/multichain-sdk';
import { midgardApi } from 'services/midgard';
import { IS_STAGENET, NETWORK } from 'settings/config';

export const globalConfig = {
  etherscanApiKey: import.meta.env.VITE_ETHERSCAN_API_KEY || '',
  ethplorerApiKey: import.meta.env.VITE_ETHPLORER_API_KEY || '',
  infuraProjectId: import.meta.env.VITE_INFURA_PROJECT_ID || '',
  networkType: NETWORK,
  thornodeMainnetApiUrl: `${import.meta.env.VITE_MAINNET_THORNODE}/thorchain` || '',
  thorchainMainnetRpc: import.meta.env.VITE_MAINNET_THORCHAIN_RPC || '',
  isThorchainStagenet: IS_STAGENET,
  dogeNodeApiKey: import.meta.env.VITE_DOGENODE_API_KEY || '',
  portisApiKey: import.meta.env.VITE_PORTIS_API_KEY || '',
  fortmaticApiKey: import.meta.env.VITE_FORTMATIC_API_KEY || '',
  ethRpcUrl: import.meta.env.VITE_RPC_URL || '',
  ethNetworkId: Number(import.meta.env.VITE_ETHEREUM_NETWORK_ID),
  blocknativeApiKey: import.meta.env.VITE_BLOCKNATIVE_API_KEY || '',
  figmentApiKey: import.meta.env.VITE_FIGMENT_API_KEY || '',
};

setGlobalConfig(globalConfig);

let multichainClient: MultiChain;

export const multichain = () =>
  (multichainClient ||= new MultiChain({
    network: NETWORK,
    midgardClient: midgardApi,
    figmentApiKey: import.meta.env.VITE_FIGMENT_API_KEY || '',
  }));
