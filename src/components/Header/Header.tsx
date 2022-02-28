import { useCallback } from 'react'

import { AppPopoverMenu } from 'components/AppPopoverMenu'
import { Button, Row, Icon } from 'components/Atomic'

import { useWallet } from 'redux/wallet/hooks'

import { t } from 'services/i18n'

type Props = {
  priceLabel: string
  gweiLabel: string
  openWalletDrawer: () => void
  connectWallet: () => void
  openMenu: () => void
}

export const Header = ({
  priceLabel,
  gweiLabel,
  // openWalletDrawer,
  openMenu,
}: Props) => {
  const { setIsConnectModalOpen } = useWallet()

  const handleClickWalletBtn = useCallback(() => {
    setIsConnectModalOpen(true)
  }, [setIsConnectModalOpen])

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
            borderless
            onClick={openMenu}
            startIcon={<Icon color="white" name="menu" size={24} />}
          />
        </Row>

        <Row className="inline-flex items-center mt-auto shrink-0 gap-x-4">
          <Button type="outline" onClick={handleClickWalletBtn}>
            {t('common.connectWallet')}
          </Button>
          <AppPopoverMenu />
        </Row>
      </Row>
    </header>
  )
}
