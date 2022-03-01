import { MetaMaskClient } from '@thorswap-lib/multichain-sdk'

import { NETWORK } from './config'

const metamask = new MetaMaskClient(NETWORK)

export { metamask }
