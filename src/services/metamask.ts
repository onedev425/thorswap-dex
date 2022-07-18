import { MetaMaskClient } from '@thorswap-lib/multichain-web-extensions'

import { NETWORK } from 'settings/config'

const metamask = new MetaMaskClient(NETWORK)

export { metamask }
