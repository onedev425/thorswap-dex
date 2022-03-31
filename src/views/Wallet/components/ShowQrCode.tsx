import { useCallback, useState } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { HoverIcon } from 'components/HoverIcon'
import { QRCodeModal } from 'components/Modals/QRCodeModal'

import { t } from 'services/i18n'

type Props = {
  chain: SupportedChain
  address: string
}

type QrCodeData = {
  chain: string
  address: string
}

const EMPTY_QR_DATA = { chain: '', address: '' }

export const ShowQrCode = ({ chain, address }: Props) => {
  const [qrData, setQrData] = useState<QrCodeData>(EMPTY_QR_DATA)

  const handleViewQRCode = useCallback(() => {
    setQrData({
      chain: chainToString(chain),
      address,
    })
  }, [chain, address])

  return (
    <>
      <HoverIcon
        iconName="qrcode"
        onClick={handleViewQRCode}
        tooltip={t('views.wallet.showQRCode')}
        size={16}
      />
      <QRCodeModal
        chain={qrData.chain}
        address={qrData.address}
        onCancel={() => setQrData(EMPTY_QR_DATA)}
      />
    </>
  )
}
