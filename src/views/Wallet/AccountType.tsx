import { memo, useMemo } from 'react'

import { chainToSigAsset } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { AccountRow } from 'views/Wallet/AccountRow'

import { Box } from 'components/Atomic'

import { useApp } from 'store/app/hooks'
import { useWallet } from 'store/wallet/hooks'

import { SORTED_CHAINS } from 'settings/chain'

import { ViewMode } from 'types/app'

import { AccountCard } from './AccountCard'

type Props = {
  keyword: string
  onlyConnected: boolean
}

export const AccountType = memo(({ onlyConnected, keyword }: Props) => {
  const { wallet } = useWallet()
  const { walletViewMode } = useApp()

  const filteredChains = useMemo(
    () =>
      SORTED_CHAINS.filter((chain) => {
        const sigAsset = chainToSigAsset(chain)
        const chainName = chainToString(chain)
        const lowerKeyword = keyword.toLowerCase()

        const isSupported = [
          sigAsset.chain.toLowerCase(),
          sigAsset.symbol.toLowerCase(),
          chainName.toLowerCase(),
        ].some((item) => item.includes(lowerKeyword))

        return (
          isSupported && (onlyConnected ? !!wallet?.[chain]?.address : true)
        )
      }),
    [keyword, onlyConnected, wallet],
  )

  switch (walletViewMode) {
    case ViewMode.CARD:
      return (
        <Box className="grid flex-col w-full grid-cols-1 gap-2.5 lg:grid-cols-2 xl:grid-cols-3 md:flex-row">
          {filteredChains.map((chain) => (
            <AccountCard key={chain} chain={chain} />
          ))}
        </Box>
      )

    case ViewMode.LIST:
      return (
        <Box className="gap-1.5" flex={1} col>
          {filteredChains.map((chain) => (
            <AccountRow key={chain} chain={chain} />
          ))}
        </Box>
      )

    default:
      return null
  }
})
