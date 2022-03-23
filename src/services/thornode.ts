import { createThornodeService } from '@thorswap-lib/thorswap-client/lib/services/thornode'

import {
  MIDGARD_MAINNET_API_URI,
  THORNODE_MAINNET_API_URI,
  NETWORK,
} from 'settings/config'

export const {
  getInboundData,
  MIDGARD_TESTNET_API_URI,
  THORNODE_API_URI,
  getLiquidityProvider,
  getThorchainMimir,
  midgardAPI,
  thornodeAPI,
} = createThornodeService({
  midgardUrl: MIDGARD_MAINNET_API_URI,
  network: NETWORK,
  thornodeUrl: THORNODE_MAINNET_API_URI,
})
