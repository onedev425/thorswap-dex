import { Midgard } from '@thorswap-lib/midgard-sdk'

import { config, IS_STAGENET } from 'settings/config'

export const midgardApi = new Midgard({
  network: IS_STAGENET ? 'stagenet' : config.network,
})
