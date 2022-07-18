import { memo, useCallback, useMemo } from 'react'

import { chainToSigAsset } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'
import { chainToString } from '@thorswap-lib/xchain-util'
import classNames from 'classnames'

import { AccountRow } from 'views/Wallet/AccountRow'

import { Box } from 'components/Atomic'

import { useApp } from 'store/app/hooks'
import { useWallet } from 'store/wallet/hooks'

import { useFetchThornames } from 'hooks/useFetchThornames'

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
  const registeredThornames = useFetchThornames()

  const filteredChains = useMemo(
    () =>
      SORTED_CHAINS.filter((chain) => {
        const sigAsset = chainToSigAsset(chain as SupportedChain)
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
      }) as SupportedChain[],
    [keyword, onlyConnected, wallet],
  )

  const getThornames = useCallback(
    (chain: SupportedChain) => {
      const { address } = wallet?.[chain] || {}
      if (!(registeredThornames && address)) return []

      return registeredThornames.reduce((acc, { entries, thorname }) => {
        const entry = entries.find((e) => e.address === address)
        if (entry) acc.push(`${thorname}.${chain.toLowerCase()}`)
        return acc
      }, [] as string[])
    },
    [registeredThornames, wallet],
  )

  return (
    <Box
      col
      className={classNames({
        'gap-1.5 flex-1': walletViewMode === ViewMode.LIST,
        'grid w-full grid-cols-1 gap-2.5 lg:grid-cols-2 xl:grid-cols-3 md:flex-row':
          walletViewMode === ViewMode.CARD,
      })}
    >
      {filteredChains.map((chain) =>
        walletViewMode === ViewMode.CARD ? (
          <AccountCard
            thornames={getThornames(chain)}
            key={chain}
            chain={chain}
          />
        ) : (
          <AccountRow
            thornames={getThornames(chain)}
            key={chain}
            chain={chain}
          />
        ),
      )}
    </Box>
  )
})
