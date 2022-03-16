import { memo } from 'react'

import { Box, Icon } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

import { ViewMode } from 'types/global'

type Props = {
  walletViewMode: ViewMode
  setWalletViewMode: (viewMode: ViewMode) => void
  keyword: string
  setKeyword: (keyword: string) => void
  onlyConnected: boolean
  setOnlyConnected: (onlyConnected: boolean) => void
}

export const SearchAndFilters = memo(
  ({ walletViewMode, setWalletViewMode, keyword, setKeyword }: Props) => {
    return (
      <Box className="w-full" alignCenter justify="between">
        <Input
          icon="search"
          border="bottom"
          placeholder={t('views.wallet.search')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Box className="space-x-6" alignCenter>
          <Icon
            name="app"
            size={20}
            color={walletViewMode === ViewMode.CARD ? 'cyan' : 'secondary'}
            onClick={() => setWalletViewMode(ViewMode.CARD)}
          />

          <Icon
            name="list"
            size={20}
            color={walletViewMode === ViewMode.LIST ? 'cyan' : 'secondary'}
            onClick={() => setWalletViewMode(ViewMode.LIST)}
          />
        </Box>
      </Box>
    )
  },
)
