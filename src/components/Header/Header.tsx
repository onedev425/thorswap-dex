import { useCallback, useMemo } from 'react'

import { hasConnectedWallet } from '@thorswap-lib/multichain-sdk'

import { AppPopoverMenu } from 'components/AppPopoverMenu'
import { Button, Row, Icon } from 'components/Atomic'

import { useWallet } from 'redux/wallet/hooks'

import { useWalletDrawer } from 'hooks/useWalletDrawer'

import { t } from 'services/i18n'

type Props = {
  priceLabel: string
  gweiLabel: string
  connectWallet: () => void
  openMenu: () => void
}

export const Header = ({ priceLabel, gweiLabel, openMenu }: Props) => {
  const { isWalletLoading, wallet, setIsConnectModalOpen } = useWallet()
  const { setIsDrawerVisible } = useWalletDrawer()

  const isConnected = useMemo(() => hasConnectedWallet(wallet), [wallet])

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
        <Row className="mt-auto shrink-0 gap-x-4">
          <Button
            className="hidden cursor-auto md:flex"
            type="outline"
            variant="tint"
          >
            {priceLabel || '-'}
          </Button>

          <Button
            className="hidden cursor-auto md:flex"
            type="outline"
            variant="tint"
            startIcon={<Icon className="mr-2" name="gwei" size={18} />}
          >
            {gweiLabel || '-'}
          </Button>

          <Button
            className="flex md:hidden"
            onClick={openMenu}
            startIcon={<Icon color="white" name="menu" size={24} />}
          />
        </Row>

        <Row className="inline-flex items-center mt-auto shrink-0 gap-x-4">
          <Button type="outline" onClick={handleClickWalletBtn}>
            {walletBtnText}
          </Button>
          <AppPopoverMenu />
        </Row>
      </Row>
    </header>
  )
}
