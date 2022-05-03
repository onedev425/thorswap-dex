import { InboundAddressesItem } from '@thorswap-lib/midgard-sdk'
import axios, { AxiosResponse } from 'axios'

import { LiquidityProvider } from 'store/midgard/types'

import {
  MIDGARD_MAINNET_API_URI,
  THORNODE_MAINNET_API_URI,
  NETWORK,
} from 'settings/config'

const THORNODE_API_URI =
  NETWORK === 'testnet'
    ? 'https://testnet.thornode.thorchain.info/thorchain'
    : THORNODE_MAINNET_API_URI

const thornodeAPI = (url: string) => `${THORNODE_API_URI}/${url}`

export const MIDGARD_TESTNET_API_URI =
  'https://testnet.midgard.thorchain.info/v2'

export const MIDGARD_STAGENET_API_URI =
  'https://stagenet-midgard.thorchain.info/v2'

export const midgardAPI = (url: string, stagenet?: boolean) =>
  `${
    NETWORK === 'testnet'
      ? MIDGARD_TESTNET_API_URI
      : stagenet
      ? MIDGARD_STAGENET_API_URI
      : MIDGARD_MAINNET_API_URI
  }/${url}`

// https://docs.thorchain.org/how-it-works/governance#mimir

export const getThorchainMimir = () => {
  return axios.get(midgardAPI('thorchain/mimir'))
}

export const getInboundData = (): Promise<
  AxiosResponse<InboundAddressesItem[]>
> => {
  return axios.get(midgardAPI('thorchain/inbound_addresses'))
}

export const getLiquidityProvider = ({
  asset,
  address,
}: {
  asset: string
  address: string
}): Promise<AxiosResponse<LiquidityProvider>> => {
  return axios.get(thornodeAPI(`pool/${asset}/liquidity_provider/${address}`))
}
