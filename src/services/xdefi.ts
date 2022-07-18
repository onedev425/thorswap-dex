import { XdefiClient } from '@thorswap-lib/multichain-web-extensions'

import { NETWORK } from 'settings/config'

const xdefi = new XdefiClient(NETWORK)

export { xdefi }
