import { Amount, SupportedChain } from '@thorswap-lib/multichain-sdk'
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
  return midgardApi.getTHORNamesByAddress(address)
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
  return dayjs()
    .add(
      // current block - expire block * 5 sec / year in seconds
      (Math.abs(lastThorchainBlock - parseInt(expire, 10)) * 5) / 31_536_000,
      'years',
    )
    .format('YYYY-MM-DD')
}
