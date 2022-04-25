import { Network } from '@thorswap-lib/xchain-client'

const safeEnv = (defaultEnv: string, env?: string) => {
  return env || defaultEnv
}

export const NETWORK =
  import.meta.env.VITE_NETWORK === 'mainnet' ? Network.Mainnet : Network.Testnet

export type Config = {
  network: Network
}

export const config: Config = {
  network: safeEnv(Network.Testnet, import.meta.env.VITE_NETWORK) as Network,
}

export const IS_AFFILIATE_ON = import.meta.env.VITE_AFFILIATE_ON === 'true'

export const MIDGARD_MAINNET_API_URI = `${safeEnv(
  'https://midgard.thorchain.info',
  import.meta.env.VITE_MAINNET_MIDGARD,
)}/v2`

export const THORNODE_MAINNET_API_URI = `${safeEnv(
  'https://thornode.thorchain.info',
  import.meta.env.VITE_MAINNET_THORNODE,
)}/thorchain`

export const IS_STAGENET = import.meta.env.VITE_IS_STAGENET === 'true'

export const IS_TESTNET =
  safeEnv('testnet', import.meta.env.VITE_NETWORK) === 'testnet'

export const IS_MAINNET = !IS_STAGENET && !IS_TESTNET

export const IS_SYNTH_ACTIVE =
  safeEnv('false', import.meta.env.VITE_IS_SYNTH_ACTIVE) === 'true'

export const IS_NETWORK_ONLINE =
  safeEnv('false', import.meta.env.VITE_IS_NETWORK_ONLINE) === 'true'

export const isNetworkOnline = (halted = false) => {
  return IS_NETWORK_ONLINE && !halted
}

export const ETH_RPC_URL = safeEnv('', import.meta.env.VITE_RPC_URL)

export const INFURA_PROJECT_ID = safeEnv(
  '',
  import.meta.env.VITE_INFURA_PROJECT_ID,
)

export const ETH_NETWORK_ID = Number(
  safeEnv('1', import.meta.env.VITE_ETHEREUM_NETWORK_ID),
)
export const BLOCKNATIVE_API_KEY = safeEnv(
  '',
  import.meta.env.VITE_BLOCKNATIVE_API_KEY,
)
