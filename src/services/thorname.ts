import { Amount } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'
import dayjs from 'dayjs'

import { midgardApi } from 'services/midgard'
import { multichain } from 'services/multichain'

type RegisterThornameParams = {
  amount: Amount
  owner?: string
  chain: SupportedChain
  address: string
  name: string
}

export const getThornameDetails = (name: string) => {
  return midgardApi.getTHORNameDetail(name)
}

export const getAddressThornames = (address: string) => {
  return midgardApi.getTHORNamesOwnerByAddress(address)
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

export const getThornameExpireDate = ({
  expire,
  lastThorchainBlock = 0,
}: {
  expire: string
  lastThorchainBlock: number
}) => {
  const blocksPerYear = 5_256_000
  const blocksDiff = lastThorchainBlock - parseInt(expire)
  const days = (blocksDiff / blocksPerYear) * -365

  return dayjs().add(days, 'days').format('YYYY-MM-DD')
}
