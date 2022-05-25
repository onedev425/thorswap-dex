import { PhantomClient } from '@thorswap-lib/multichain-sdk'

import { NETWORK } from 'settings/config'

const phantom = new PhantomClient(NETWORK)

export { phantom }
