import { Network } from '@thorswap-lib/xchain-client'

export const NETWORK =
  process.env.REACT_APP_NETWORK === 'mainnet'
    ? Network.Mainnet
    : Network.Testnet
