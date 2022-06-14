import { KeplrClient } from '@thorswap-lib/multichain-sdk'

import { NETWORK } from 'settings/config'

const keplr = new KeplrClient(NETWORK)

export { keplr }
