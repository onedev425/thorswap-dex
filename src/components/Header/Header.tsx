import { memo, useCallback, useMemo } from 'react'

import { hasConnectedWallet } from '@thorswap-lib/multichain-sdk'

import { AnnouncementsPopover } from 'components/Announcements/AnnouncementsPopover/AnnouncementsPopover'
import { HeaderAnnouncements } from 'components/Announcements/HeaderAnnouncements'
import { AppPopoverMenu } from 'components/AppPopoverMenu'
import { Button, Icon, Box, Typography } from 'components/Atomic'
import { TxManager } from 'components/TxManager'

import { useApp } from 'store/app/hooks'
import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'

import { useWalletDrawer } from 'hooks/useWalletDrawer'
import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { ThemeType } from 'types/app'

import { StatusDropdown } from './StatusDropdown'

type Props = {
  openMenu: () => void
}

export const Header = memo(({ openMenu }: Props) => {
  const { themeType } = useApp()
  const { isWalletLoading, wallet, setIsConnectModalOpen } = useWallet()
  const { setIsDrawerVisible } = useWalletDrawer()
  const { stats } = useMidgard()
  const { isMdActive } = useWindowSize()

  const isConnected = useMemo(() => hasConnectedWallet(wallet), [wallet])

  const runeLabel = useMemo(
    () =>
      stats?.runePriceUSD
        ? `$${parseFloat(stats.runePriceUSD || '').toFixed(2)}`
        : '$ -',
    [stats],
  )

  const handleClickWalletBtn = useCallback(() => {
    if (!isConnected && !isWalletLoading) {
      setIsConnectModalOpen(true)
    } else {
      setIsDrawerVisible(true)
    }
  }, [isConnected, isWalletLoading, setIsConnectModalOpen, setIsDrawerVisible])

  return (
    <header className="mb-5 min-h-[70px]">
      <Box justify="between">
        <Box className="mt-auto shrink-0 gap-x-2 mr-2">
          <Button
            className="flex !p-1 md:hidden"
            onClick={openMenu}
            type="borderless"
            startIcon={<Icon name="menu" size={isMdActive ? 24 : 20} />}
          />

          <Box
            className="h-9.5 px-2 bg-white border border-transparent border-solid shadow-md rounded-2xl dark:border-cyan dark:bg-transparent"
            center
          >
            <Typography
              variant={isMdActive ? 'caption' : 'caption-xs'}
              className="transition-[font-size]"
              fontWeight="semibold"
            >
              1ᚱ = {runeLabel}
            </Typography>
          </Box>

          <Box className="hidden md:flex gap-x-2">
            <StatusDropdown />
          </Box>
        </Box>

        <Box justify="between">
          <Button
            className="mr-2"
            type={themeType === ThemeType.Light ? 'default' : 'outline'}
            onClick={handleClickWalletBtn}
            size="sm"
            endIcon={
              isWalletLoading ? <Icon name="loader" spin size={14} /> : null
            }
          >
            {isWalletLoading
              ? t('common.loading')
              : isConnected
              ? t('common.wallet')
              : t('common.connect')}
          </Button>
          <AnnouncementsPopover />
          <AppPopoverMenu />
          <TxManager />
        </Box>
      </Box>
      <HeaderAnnouncements />
    </header>
  )
})
