import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'

import {
  chainToSigAsset,
  SupportedChain,
  SUPPORTED_CHAINS as supportedChains,
} from '@thorswap-lib/multichain-sdk'

import { AccountType } from 'views/Wallet/AccountType'
import { SearchAndFilters } from 'views/Wallet/SearchAndFilters'

import { Box } from 'components/Atomic'
import { Helmet } from 'components/Helmet'

import { useApp } from 'redux/app/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { t } from 'services/i18n'

const Wallet = () => {
  const [keyword, setKeyword] = useState('')
  const [onlyConnected, setOnlyConnected] = useState(false)

  const dispatch = useDispatch()
  const { walletViewMode, setWalletViewMode } = useApp()
  const { geckoData, geckoDataLoading, getCoingeckoData } = useWallet()

  useEffect(() => {
    supportedChains.forEach((chain) => {
      const asset = chainToSigAsset(chain as SupportedChain)

      if (!geckoData?.[asset.symbol]) {
        dispatch(getCoingeckoData({ symbol: asset.symbol }))
      }
    })
  }, [dispatch, geckoData, geckoDataLoading, getCoingeckoData])

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
