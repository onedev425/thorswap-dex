import { useCallback, useMemo } from 'react'

import { useLocation } from 'react-router-dom'

import { hasConnectedWallet } from '@thorswap-lib/multichain-sdk'

import { AppPopoverMenu } from 'components/AppPopoverMenu'
import { Button, Row, Icon, Box } from 'components/Atomic'
import { GasTracker } from 'components/GasTracker'
import { Refresh } from 'components/Refresh'
import { StatusDropdown } from 'components/StatusDropdown'

import { useGlobalState } from 'redux/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { useWalletDrawer } from 'hooks/useWalletDrawer'

import { t } from 'services/i18n'

type Props = {
  openMenu: () => void
}

export const Header = ({ openMenu }: Props) => {
  const { isWalletLoading, wallet, setIsConnectModalOpen } = useWallet()
  const { setIsDrawerVisible } = useWalletDrawer()
  const { refreshPage } = useGlobalState()
  const location = useLocation()

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
        <Row className="mt-auto shrink-0 gap-x-2">
          <Button
            className="flex !p-1 !mr-2 md:hidden"
            onClick={openMenu}
            type="borderless"
            startIcon={<Icon color="white" name="menu" size={24} />}
          />

          <Box className="hidden md:flex gap-x-2">
            <GasTracker />
            <StatusDropdown />
          </Box>
        </Row>

        <Row className="inline-flex items-center mt-auto shrink-0 gap-x-2">
          <Button type="outline" onClick={handleClickWalletBtn}>
            {walletBtnText}
          </Button>
          <Refresh onRefresh={() => refreshPage(location)} />
          <AppPopoverMenu />
        </Row>
      </Row>
    </header>
  )
}
