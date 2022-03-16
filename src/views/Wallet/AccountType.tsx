import { memo, useMemo } from 'react'

import {
  chainToSigAsset,
  SUPPORTED_CHAINS as supportedChains,
} from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { AccountRow } from 'views/Wallet/AccountRow'

import { Box } from 'components/Atomic'

import { useApp } from 'redux/app/hooks'

import { ViewMode } from 'types/global'

import { AccountCard } from './AccountCard'

type Props = {
  keyword: string
}

export const AccountType = memo(({ keyword }: Props) => {
  const { walletViewMode } = useApp()

  const filteredChains = useMemo(
    () =>
      supportedChains.filter((chain) => {
        const sigAsset = chainToSigAsset(chain)
        const chainName = chainToString(chain)
        const lowerKeyword = keyword.toLowerCase()

        const isSupported = [
          sigAsset.chain.toLowerCase(),
          sigAsset.symbol.toLowerCase(),
          chainName.toLowerCase(),
        ].some((item) => item.includes(lowerKeyword))

        return isSupported
      }),
    [keyword],
  )

  switch (walletViewMode) {
    case ViewMode.CARD:
      return (
        <Box className="grid flex-col w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:flex-row">
          {filteredChains.map((chain) => (
            <AccountCard key={chain} chain={chain} />
          ))}
        </Box>
      )

    case ViewMode.LIST:
      return (
        <Box flex={1} col>
          {filteredChains.map((chain) => (
            <AccountRow key={chain} chain={chain} />
          ))}
        </Box>
      )

    default:
      return null
  }
})
