import { ReactNode, useCallback, useState } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { Box } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'
import { QRCodeModal } from 'components/Modals/QRCodeModal'

import { t } from 'services/i18n'

type Props = {
  chain: SupportedChain
  address: string
  openComponent?: ReactNode
}

type QrCodeData = {
  chain: string
  address: string
}

const EMPTY_QR_DATA = { chain: '', address: '' }

export const ShowQrCode = ({ chain, address, openComponent }: Props) => {
  const [qrData, setQrData] = useState<QrCodeData>(EMPTY_QR_DATA)

  const handleViewQRCode = useCallback(() => {
    if (address) {
      setQrData({
        chain: chainToString(chain),
        address,
      })
    }
  }, [chain, address])

  return (
    <>
      {openComponent ? (
        <Box onClick={handleViewQRCode}>{openComponent}</Box>
      ) : (
        <HoverIcon
          tooltip={
            address
              ? t('views.wallet.showQRCode')
              : t('views.walletModal.notConnected')
          }
          iconName="qrcode"
          onClick={handleViewQRCode}
          size={16}
        />
      )}

      <QRCodeModal
        chain={qrData.chain}
        address={qrData.address}
        onCancel={() => setQrData(EMPTY_QR_DATA)}
      />
    </>
  )
}
