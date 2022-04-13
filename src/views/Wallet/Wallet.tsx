import { useState } from 'react'

import { AccountType } from 'views/Wallet/AccountType'
import { useLoadWalletAssetsInfo } from 'views/Wallet/hooks'
import { SearchAndFilters } from 'views/Wallet/SearchAndFilters'

import { Box } from 'components/Atomic'
import { Helmet } from 'components/Helmet'

import { useApp } from 'store/app/hooks'

import { t } from 'services/i18n'

const Wallet = () => {
  const [keyword, setKeyword] = useState('')
  const [onlyConnected, setOnlyConnected] = useState(false)

  const { walletViewMode, setWalletViewMode } = useApp()

  useLoadWalletAssetsInfo()

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
