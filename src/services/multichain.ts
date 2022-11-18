import { MultiChain, setGlobalConfig } from '@thorswap-lib/multichain-core';
import { Network } from '@thorswap-lib/types';
import { IS_STAGENET, MIDGARD_URL, THORNODE_URL } from 'settings/config';

setGlobalConfig({
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_KEY || '',
  blockchairApiKey: import.meta.env.VITE_BLOCKCHAIR_API_KEY || '',
  covalentApiKey: import.meta.env.VITE_COVALENT_API_KEY || '',
  dogeNodeApiKey: import.meta.env.VITE_DOGENODE_API_KEY || '',
  etherscanApiKey: import.meta.env.VITE_ETHERSCAN_API_KEY || '',
  ethplorerApiKey: import.meta.env.VITE_ETHPLORER_API_KEY || '',
  isThorchainStagenet: IS_STAGENET,
  networkType: Network.Mainnet,
  midgardUrl: MIDGARD_URL,
  thornodeMainnetApiUrl: THORNODE_URL,
});

let multichainClient: MultiChain;

export const multichain = () => {
  try {
    return (multichainClient ||= new MultiChain({
      network: Network.Mainnet,
      allthatnodeApiKey: import.meta.env.VITE_ALLTHATNODE_KEY || '',
    }));
  } catch (error: any) {
    console.error(error);
    return multichainClient;
  }
};
