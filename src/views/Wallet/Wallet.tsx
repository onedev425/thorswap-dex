import { useEffect, useState } from 'react'

import { chainToSigAsset, SUPPORTED_CHAINS } from '@thorswap-lib/multichain-sdk'

import { AccountType } from 'views/Wallet/AccountType'
import { SearchAndFilters } from 'views/Wallet/SearchAndFilters'

import { Box } from 'components/Atomic'
import { Helmet } from 'components/Helmet'

import { useApp } from 'store/app/hooks'
import { useAppDispatch } from 'store/store'
import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'

const Wallet = () => {
  const [keyword, setKeyword] = useState('')
  const [onlyConnected, setOnlyConnected] = useState(false)

  const { walletViewMode, setWalletViewMode } = useApp()

  const dispatch = useAppDispatch()
  const { getCoingeckoData, geckoData } = useWallet()

  useEffect(() => {
    const sigSymbols = SUPPORTED_CHAINS.filter((chain) => {
      const asset = chainToSigAsset(chain)
      return !geckoData?.[asset.ticker]
    }).map((chain) => chainToSigAsset(chain).ticker)

    if (sigSymbols.length > 0) {
      dispatch(getCoingeckoData(sigSymbols))
    }
  }, [geckoData, dispatch, getCoingeckoData])

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

      <Box className="w-full" mt={4}>
        <AccountType onlyConnected={onlyConnected} keyword={keyword} />
      </Box>
    </Box>
  )
}

export default Wallet
