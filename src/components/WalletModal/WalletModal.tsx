import { useCallback, useMemo, useState } from 'react'

import { Box, Card, Icon, Modal } from 'components/Atomic'

import { useWallet } from 'redux/wallet/hooks'

import { t } from 'services/i18n'
import { xdefi } from 'services/xdefi'

import { WalletStage } from './types'
import { WalletOption } from './WalletOption'

export const WalletModal = () => {
  const [walletStage] = useState<WalletStage>(WalletStage.WalletSelect)

  const { isConnectModalOpen, setIsConnectModalOpen } = useWallet()

  const xdefiInstalled = useMemo(() => xdefi.isWalletDetected(), [])

  const handleCloseModal = useCallback(() => {
    setIsConnectModalOpen(false)
  }, [setIsConnectModalOpen])

  const renderMainPanel = useMemo(() => {
    return (
      <Box className="w-full space-y-3" col>
        <WalletOption
          title={
            xdefiInstalled
              ? t('views.walletModal.connectXdefi')
              : t('views.walletModal.installXdefi')
          }
          icon={<Icon name="xdefi" />}
        />
        <WalletOption
          title="WalletConnect"
          icon={<Icon name="walletConnect" />}
        />
        <WalletOption title="Connect XDEFI" icon={<Icon name="metamask" />} />
        <WalletOption title="Connect XDEFI" icon={<Icon name="metamask" />} />
      </Box>
    )
  }, [xdefiInstalled])

  return (
    <Modal
      title="Connect Wallet"
      isOpened={isConnectModalOpen}
      withBody={false}
      onClose={handleCloseModal}
    >
      <Card className="w-[85vw] max-w-[420px] md:w-[65vw]" stretch size="lg">
        {walletStage === WalletStage.WalletSelect && renderMainPanel}
      </Card>
    </Modal>
  )
}
