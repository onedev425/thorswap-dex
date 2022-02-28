import { XdefiClient } from '@thorswap-lib/multichain-sdk'

import { NETWORK } from './config'

const xdefi = new XdefiClient(NETWORK)

export { xdefi }
