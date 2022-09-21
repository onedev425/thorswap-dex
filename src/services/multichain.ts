import { MultiChain, setGlobalConfig } from '@thorswap-lib/multichain-core';
import { midgardApi } from 'services/midgard';
import { IS_STAGENET, NETWORK, THORNODE_URL } from 'settings/config';

export const globalConfig = {
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_KEY || '',
  covalentApiKey: import.meta.env.VITE_COVALENT_API_KEY || '',
  dogeNodeApiKey: import.meta.env.VITE_DOGENODE_API_KEY || '',
  etherscanApiKey: import.meta.env.VITE_ETHERSCAN_API_KEY || '',
  ethplorerApiKey: import.meta.env.VITE_ETHPLORER_API_KEY || '',
  figmentApiKey: import.meta.env.VITE_FIGMENT_API_KEY || '',
  isThorchainStagenet: IS_STAGENET,
  networkType: NETWORK,
  thornodeMainnetApiUrl: THORNODE_URL,
};

setGlobalConfig(globalConfig);

let multichainClient: MultiChain;

export const multichain = () =>
  (multichainClient ||= new MultiChain({
    network: NETWORK,
    midgardClient: midgardApi,
    figmentApiKey: import.meta.env.VITE_FIGMENT_API_KEY || '',
  }));
