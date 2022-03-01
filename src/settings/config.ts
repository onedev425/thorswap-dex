import { Network } from '@thorswap-lib/xchain-client'

const safeEnv = (defaultEnv: string, env?: string) => {
  return env || defaultEnv
}

export const NETWORK =
  process.env.REACT_APP_NETWORK === 'mainnet'
    ? Network.Mainnet
    : Network.Testnet

export type Config = {
  network: Network
  environment: string
}

export const config: Config = {
  network: safeEnv(Network.Testnet, process.env.REACT_APP_NETWORK) as Network,
  environment: process.env.NODE_ENV,
}

export const MIDGARD_MAINNET_API_URI = `${safeEnv(
  'https://midgard.thorchain.info',
  process.env.REACT_APP_MAINNET_MIDGARD,
)}/v2`

export const THORNODE_MAINNET_API_URI = `${safeEnv(
  'https://thornode.thorchain.info',
  process.env.REACT_APP_MAINNET_THORNODE,
)}/thorchain`

export const IS_STAGENET = process.env.REACT_APP_IS_STAGENET === 'true'

export const IS_TESTNET =
  safeEnv('testnet', process.env.REACT_APP_NETWORK) === 'testnet'

export const IS_MAINNET = !IS_STAGENET && !IS_TESTNET

export const IS_SYNTH_ACTIVE =
  safeEnv('false', process.env.REACT_APP_IS_SYNTH_ACTIVE) === 'true'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const IS_NETWORK_ONLINE =
  safeEnv('false', process.env.REACT_APP_IS_NETWORK_ONLINE) === 'true'

export const isNetworkOnline = (halted = false) => {
  return IS_NETWORK_ONLINE && !halted
}

export const ETH_RPC_URL = safeEnv('', process.env.REACT_APP_RPC_URL)

export const INFURA_PROJECT_ID = safeEnv(
  '',
  process.env.REACT_APP_INFURA_PROJECT_ID,
)

export const ETH_NETWORK_ID = Number(
  safeEnv('1', process.env.REACT_APP_ETHEREUM_NETWORK_ID),
)
export const BLOCKNATIVE_API_KEY = safeEnv(
  '',
  process.env.REACT_APP_BLOCKNATIVE_API_KEY,
)
