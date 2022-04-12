import { memo } from 'react'

import classNames from 'classnames'

import { Box, Button, Icon, SwitchToggle, Typography } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

import { ViewMode } from 'types/app'

type Props = {
  walletViewMode: ViewMode
  setWalletViewMode: (viewMode: ViewMode) => void
  keyword: string
  setKeyword: (keyword: string) => void
  onlyConnected: boolean
  setOnlyConnected: (onlyConnected: boolean) => void
}

export const SearchAndFilters = memo(
  ({
    setOnlyConnected,
    onlyConnected,
    walletViewMode,
    setWalletViewMode,
    keyword,
    setKeyword,
  }: Props) => {
    return (
      <Box
        className="w-full px-1.5 flex-wrap gap-2"
        alignCenter
        justify="between"
      >
        <Input
          icon="search"
          border="rounded"
          placeholder={t('views.wallet.search')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Box className="space-x-6" alignCenter>
          <Box center className="gap-x-2 rounded-2xl">
            <Typography variant="caption">
              {t('views.wallet.showOnlyConnectedChains')}
            </Typography>
            <SwitchToggle checked={onlyConnected} onChange={setOnlyConnected} />
          </Box>

          <Box center>
            <Button
              onClick={() => setWalletViewMode(ViewMode.CARD)}
              startIcon={<Icon name="grid" size={20} />}
              className={classNames('pl-3 pr-3 !rounded-r-none', {
                '!bg-opacity-90 dark:!bg-opacity-50':
                  walletViewMode === ViewMode.CARD,
              })}
              variant={walletViewMode === ViewMode.CARD ? 'primary' : 'tint'}
              type={walletViewMode === ViewMode.CARD ? 'default' : 'outline'}
              tooltip={t('views.wallet.gridView')}
            ></Button>

            <Button
              onClick={() => setWalletViewMode(ViewMode.LIST)}
              startIcon={<Icon name="list" size={20} />}
              className={classNames('pl-2 pr-3 !rounded-l-none', {
                '!bg-opacity-90 dark:!bg-opacity-50':
                  walletViewMode === ViewMode.LIST,
              })}
              variant={walletViewMode === ViewMode.LIST ? 'primary' : 'tint'}
              type={walletViewMode === ViewMode.LIST ? 'default' : 'outline'}
              tooltip={t('views.wallet.listView')}
            ></Button>
          </Box>
        </Box>
      </Box>
    )
  },
)
