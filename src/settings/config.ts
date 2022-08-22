import { Network } from '@thorswap-lib/types'

const safeEnv = (defaultEnv: string, env?: string) => {
  return env || defaultEnv
}

export const NETWORK =
  import.meta.env.VITE_NETWORK === 'mainnet' ? Network.Mainnet : Network.Testnet

export type Config = {
  network: Network
}

export const config: Config = {
  network: (import.meta.env.VITE_NETWORK || Network.Testnet) as Network,
}

export const MIDGARD_MAINNET_API_URI = `${
  import.meta.env.VITE_MAINNET_MIDGARD || 'https://midgard.thorswap.net'
}/v2`

export const THORNODE_MAINNET_API_URI = `${
  import.meta.env.VITE_MAINNET_THORNODE || 'https://thornode.thorchain.info'
}/thorchain`

export const IS_STAGENET = import.meta.env.VITE_IS_STAGENET === 'true'

export const IS_TESTNET =
  (import.meta.env.VITE_NETWORK || 'testnet') === 'testnet'

export const IS_MAINNET = !IS_STAGENET && !IS_TESTNET

export const INFURA_PROJECT_ID = safeEnv(
  '',
  import.meta.env.VITE_INFURA_PROJECT_ID,
)

export const THORSWAP_API_URL =
  import.meta.env.VITE_THORSWAP_API || 'https://dev-api2.thorswap.net'

export const BLOCKNATIVE_API_KEY = safeEnv(
  '',
  import.meta.env.VITE_BLOCKNATIVE_API_KEY,
)
