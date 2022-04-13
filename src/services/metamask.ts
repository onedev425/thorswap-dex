import { MetaMaskClient } from '@thorswap-lib/multichain-sdk'

import { NETWORK } from 'settings/config'

const metamask = new MetaMaskClient(NETWORK)

export { metamask }
