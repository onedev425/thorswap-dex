import { useCallback, useMemo } from 'react'

import { Amount, hasConnectedWallet } from '@thorswap-lib/multichain-sdk'

import { AppPopoverMenu } from 'components/AppPopoverMenu'
import { Button, Row, Icon, Box } from 'components/Atomic'
import { GasTracker } from 'components/GasTracker'
import { StatusDropdown } from 'components/StatusDropdown'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

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

  const priceLabel = useMemo(
    () => `1ᚱ = $${Amount.fromNormalAmount(stats?.runePriceUSD).toFixed(2)}`,
    [stats],
  )

  const walletBtnText = useMemo(() => {
    if (isWalletLoading) return t('common.loading')

    if (!isConnected) return t('common.connectWallet')

    return t('common.wallet')
  }, [isConnected, isWalletLoading])

  const handleClickWalletBtn = useCallback(() => {
    if (!isConnected && !isWalletLoading) {
      setIsConnectModalOpen(true)
    } else {
      setIsDrawerVisible(true)
    }
  }, [isConnected, isWalletLoading, setIsConnectModalOpen, setIsDrawerVisible])

  return (
    <header className="mb-5">
      <Row className="min-h-[70px]" justify="between">
        <Row className="mt-auto shrink-0 gap-x-2">
          <Button
            variant="tint"
            type="outline"
            className="hidden !bg-transparent !border-1 !border-solid cursor-auto md:flex dark:border-btn-primary"
          >
            {priceLabel || '-'}
          </Button>

          <Box className="hidden md:flex gap-x-2">
            <GasTracker />
            <StatusDropdown />
          </Box>

          <Button
            className="flex md:hidden"
            onClick={openMenu}
            startIcon={<Icon color="white" name="menu" size={24} />}
          />
        </Row>

        <Row className="inline-flex items-center mt-auto shrink-0 gap-x-2">
          <Button type="outline" onClick={handleClickWalletBtn}>
            {walletBtnText}
          </Button>
          <Box
            className="p-2.5 cursor-pointer rounded-2xl hover:bg-btn-light-tint-active dark:hover:bg-btn-dark-tint-active"
            alignCenter
            justifyCenter
            onClick={() => console.warn('button clicked!')}
          >
            <Icon name="refresh" size={20} />
          </Box>
          <AppPopoverMenu />
        </Row>
      </Row>
    </header>
  )
}
