import { XdefiClient } from '@thorswap-lib/multichain-sdk'

import { NETWORK } from 'settings/config'

const xdefi = new XdefiClient(NETWORK)

export { xdefi }
