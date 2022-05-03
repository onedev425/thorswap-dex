import { THORNameDetails } from '@thorswap-lib/midgard-sdk'
import { Amount, SupportedChain } from '@thorswap-lib/multichain-sdk'

import { midgardApi } from 'services/midgard'
import { multichain } from 'services/multichain'

type RegisterThornameParams = {
  amount: Amount
  owner?: string
  chain: SupportedChain
  address: string
  name: string
}

export const getThornameDetails = (name: string): Promise<THORNameDetails> => {
  return midgardApi.getTHORNameDetail(name)
}

export const registerThorname = ({
  amount,
  chain,
  name,
  address,
  owner,
}: RegisterThornameParams) => {
  return multichain.registerThorname({ address, owner, name, chain }, amount)
}
