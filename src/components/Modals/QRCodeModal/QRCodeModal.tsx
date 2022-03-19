import { useEffect, useState } from 'react'

import QRCode from 'react-qr-code'

import { Box, Modal, Icon, Tooltip, Typography } from 'components/Atomic'

import { useAddressUtils } from 'hooks/useAddressUtils'

type Props = {
  address: string
  chain: string
  title?: string
  onCancel: () => void
}

export const QRCodeModal = ({ title, address, onCancel, chain }: Props) => {
  const [isOpened, setIsOpened] = useState(false)
  const { handleCopyAddress, miniAddress } = useAddressUtils(address)

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
        <Typography>{chain}</Typography>
        <Box className="gap-3" mt={16}>
          <QRCode value={address} />
        </Box>
        <Box alignCenter mt={3}>
          <Typography>{miniAddress}</Typography>
          <Tooltip content="Copy">
            <Icon
              className="p-1.5 ml-2 cursor-pointer rounded-2xl hover:bg-btn-light-tint-active dark:hover:bg-btn-dark-tint-active"
              name="copy"
              color="secondary"
              size={18}
              onClick={handleCopyAddress}
            />
          </Tooltip>
        </Box>
      </Box>
    </Modal>
  )
}
