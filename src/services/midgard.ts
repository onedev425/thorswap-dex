import { Midgard } from '@thorswap-lib/midgard-sdk'

import { config } from 'settings/config'

export const midgardApi = new Midgard({ network: config.network })
