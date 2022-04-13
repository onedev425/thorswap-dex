import { useCallback, useMemo } from 'react'

import { hasConnectedWallet } from '@thorswap-lib/multichain-sdk'

import { AppPopoverMenu } from 'components/AppPopoverMenu'
import { Button, Icon, Box, Typography } from 'components/Atomic'
import { GasTracker } from 'components/GasTracker'
import { StatusDropdown } from 'components/StatusDropdown'
import { TxManager } from 'components/TxManager'

import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'

import { useWalletDrawer } from 'hooks/useWalletDrawer'

import { t } from 'services/i18n'

type Props = {
  openMenu: () => void
}

export const Header = ({ openMenu }: Props) => {
  const { isWalletLoading, wallet, setIsConnectModalOpen } = useWallet()
  const { setIsDrawerVisible } = useWalletDrawer()
  const { stats } = useMidgard()

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
    <header className="mb-5">
      <Box className="min-h-[70px]" justify="between">
        <Box className="mt-auto shrink-0 gap-x-2">
          <Button
            className="flex !p-1 md:hidden"
            onClick={openMenu}
            type="borderless"
            startIcon={<Icon name="menu" size={24} />}
          />

          <Box
            className="h-10 px-2 border border-solid rounded-2xl border-cyan"
            center
          >
            <Typography
              variant="caption"
              className="transition-[font-size]"
              fontWeight="semibold"
            >
              1ᚱ = {runeLabel}
            </Typography>
          </Box>

          <Box className="hidden md:flex gap-x-2">
            <GasTracker />
            <StatusDropdown />
          </Box>
        </Box>

        <Box className="min-h-[70px]" justify="between">
          <Button
            className="mr-2"
            type="outline"
            onClick={handleClickWalletBtn}
          >
            {isWalletLoading
              ? t('common.loading')
              : isConnected
              ? t('common.wallet')
              : t('common.connectWallet')}
          </Button>
          <AppPopoverMenu />
          <TxManager />
        </Box>
      </Box>
    </header>
  )
}
