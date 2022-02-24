import { MultiChain } from '@thorswap-lib/multichain-sdk'
import { setGlobalConfig } from '@thorswap-lib/multichain-sdk/lib/config'

import { NETWORK } from './config'

setGlobalConfig({
  etherscanApiKey: process.env.REACT_APP_ETHERSCAN_API_KEY || '',
  ethplorerApiKey: process.env.REACT_APP_ETHPLORER_API_KEY || '',
  infuraProjectId: process.env.REACT_APP_INFURA_PROJECT_ID || '',
  networkType: NETWORK,
  midgardMainnetApiUrl: process.env.REACT_APP_MAINNET_MIDGARD || '',
  thornodeMainnetApiUrl: process.env.REACT_APP_MAINNET_THORNODE || '',
  thorchainMainnetRpc: process.env.REACT_APP_MAINNET_THORCHAIN_RPC || '',
  isThorchainStagenet: false,
  dogeNodeApiKey: process.env.REACT_APP_DOGENODE_API_KEY || '',
  portisApiKey: process.env.REACT_APP_PORTIS_API_KEY || '',
  fortmaticApiKey: process.env.REACT_APP_FORTMATIC_API_KEY || '',
  ethRpcUrl: process.env.REACT_APP_RPC_URL || '',
  ethNetworkId: Number(process.env.REACT_APP_ETHEREUM_NETWORK_ID),
  blocknativeApiKey: process.env.REACT_APP_BLOCKNATIVE_API_KEY || '',
})

export const multichain = new MultiChain({ network: NETWORK })
