import { useEffect, useState } from 'react'

import QRCode from 'qrcode-react'

import { Box, Modal, Icon, Tooltip, Typography } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'

import { useAddressUtils } from 'hooks/useAddressUtils'

import Logo from 'assets/images/logo.png'

type Props = {
  address: string
  chain: string
  title?: string
  onCancel: () => void
}

export const QRCodeModal = ({ title, address, onCancel, chain }: Props) => {
  const [isOpened, setIsOpened] = useState(false)
  const { shortAddress, handleCopyAddress } = useAddressUtils(address)

  useEffect(() => {
    if (address) {
      setIsOpened(true)
    }
  }, [address])

  const onClose = () => {
    setIsOpened(false)
    // call onCancel callback after modal close animation
    setTimeout(() => onCancel(), 300)
  }

  return (
    <Modal title={title || ''} isOpened={isOpened} onClose={onClose}>
      <Box center col>
        <Typography variant="subtitle2">{chain}</Typography>
        <Box className="gap-3 p-2 bg-white rounded-xl" mt={16}>
          <QRCode size={256} value={address} logo={Logo} logoWidth={64} />
        </Box>
        <Box className="space-x-2" alignCenter mt={3}>
          <Typography>{shortAddress}</Typography>
          <Tooltip content="Copy">
            <Box className={baseHoverClass}>
              <Icon
                className="cursor-pointer"
                name="copy"
                color="cyan"
                size={18}
                onClick={handleCopyAddress}
              />
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Modal>
  )
}
