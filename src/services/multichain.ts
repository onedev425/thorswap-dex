import { MultiChain, setGlobalConfig } from '@thorswap-lib/multichain-sdk'

import { NETWORK } from 'settings/config'

export const globalConfig = {
  etherscanApiKey: import.meta.env.VITE_ETHERSCAN_API_KEY || '',
  ethplorerApiKey: import.meta.env.VITE_ETHPLORER_API_KEY || '',
  infuraProjectId: import.meta.env.VITE_INFURA_PROJECT_ID || '',
  networkType: NETWORK,
  midgardMainnetApiUrl: import.meta.env.VITE_MAINNET_MIDGARD || '',
  thornodeMainnetApiUrl:
    `${import.meta.env.VITE_MAINNET_THORNODE}/thorchain` || '',
  thorchainMainnetRpc: import.meta.env.VITE_MAINNET_THORCHAIN_RPC || '',
  isThorchainStagenet: import.meta.env.VITE_IS_STAGENET === 'true',
  dogeNodeApiKey: import.meta.env.VITE_DOGENODE_API_KEY || '',
  portisApiKey: import.meta.env.VITE_PORTIS_API_KEY || '',
  fortmaticApiKey: import.meta.env.VITE_FORTMATIC_API_KEY || '',
  ethRpcUrl: import.meta.env.VITE_RPC_URL || '',
  ethNetworkId: Number(import.meta.env.VITE_ETHEREUM_NETWORK_ID),
  blocknativeApiKey: import.meta.env.VITE_BLOCKNATIVE_API_KEY || '',
  isAffiliated: import.meta.env.VITE_AFFILIATE_ON,
}

setGlobalConfig(globalConfig)

export const multichain = new MultiChain({
  network: NETWORK,
  figmentApiKey: import.meta.env.VITE_FIGMENT_API_KEY || '',
})
