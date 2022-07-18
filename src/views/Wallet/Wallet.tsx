import { useEffect, useMemo, useState } from 'react'

import { chainToSigAsset } from '@thorswap-lib/multichain-sdk'
import { SUPPORTED_CHAINS } from '@thorswap-lib/types'

import { AccountType } from 'views/Wallet/AccountType'
import { SearchAndFilters } from 'views/Wallet/SearchAndFilters'

import { Box } from 'components/Atomic'
import { Helmet } from 'components/Helmet'

import { useApp } from 'store/app/hooks'
import { useAppDispatch } from 'store/store'
import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'

const Wallet = () => {
  const dispatch = useAppDispatch()
  const { walletViewMode, setWalletViewMode } = useApp()
  const { getCoingeckoData, geckoData } = useWallet()

  const [keyword, setKeyword] = useState('')
  const [onlyConnected, setOnlyConnected] = useState(false)

  const filteredGeckoData = useMemo(
    () =>
      SUPPORTED_CHAINS.filter((chain) => {
        const { ticker } = chainToSigAsset(chain)
        return !geckoData?.[ticker]
      }),
    [geckoData],
  )

  const sigSymbols = useMemo(
    () => filteredGeckoData.map((chain) => chainToSigAsset(chain).ticker),
    [filteredGeckoData],
  )

  useEffect(() => {
    if (sigSymbols.length > 0) {
      dispatch(getCoingeckoData(sigSymbols))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sigSymbols.length])

  return (
    <Box className="w-full" col>
      <Helmet
        title={t('views.wallet.wallet')}
        content={t('views.wallet.wallet')}
      />
      <SearchAndFilters
        walletViewMode={walletViewMode}
        setKeyword={setKeyword}
        keyword={keyword}
        onlyConnected={onlyConnected}
        setOnlyConnected={setOnlyConnected}
        setWalletViewMode={setWalletViewMode}
      />

      <Box className="w-full mt-4">
        <AccountType onlyConnected={onlyConnected} keyword={keyword} />
      </Box>
    </Box>
  )
}

export default Wallet
