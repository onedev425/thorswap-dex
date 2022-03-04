import { useCallback, useMemo } from 'react'

import { Amount, hasConnectedWallet } from '@thorswap-lib/multichain-sdk'

import { AppPopoverMenu } from 'components/AppPopoverMenu'
import { Button, Row, Icon } from 'components/Atomic'
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
          <Button className="hidden !bg-transparent !border-1 !border-solid cursor-auto md:flex border-light-bg-primary dark:border-btn-primary">
            {priceLabel || '-'}
          </Button>

          <GasTracker />
          <StatusDropdown />
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
          <AppPopoverMenu />
        </Row>
      </Row>
    </header>
  )
}
