import { useCallback, useState } from 'react'

import { Box, Button, Modal } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { useConfirmInfoItems } from 'components/Modals/ConfirmSwap/useConfirmInfoItems'
import { PasswordInput } from 'components/PasswordInput'

import { t } from 'services/i18n'

type Props = {
  address: string
  estimatedTime: string
  fee: string
  isOpened: boolean
  onClose: () => void
  receive: { value: string; symbol: string }
  send: { value: string; symbol: string }
  showPassword?: boolean
  slippage: number
  totalFee?: string
}

export const ConfirmSwap = ({
  address,
  estimatedTime,
  fee,
  isOpened,
  onClose,
  receive,
  send,
  showPassword = true,
  slippage,
  totalFee,
}: Props) => {
  const [password, setPassword] = useState('')
  const handleConfirmPress = useCallback(() => {
    setPassword('')
    onClose()
  }, [onClose])

  const confirmInfoItems = useConfirmInfoItems({
    address,
    send,
    receive,
    fee,
    totalFee,
    estimatedTime,
    slippage,
  })

  return (
    <Modal
      title={t('views.wallet.confirmSwap')}
      isOpened={isOpened}
      onClose={onClose}
    >
      <Box col className="gap-y-4 md:gap-y-8 md:!min-w-[350px]">
        <InfoTable items={confirmInfoItems} />

        {showPassword && (
          <PasswordInput
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        )}

        <Button onClick={handleConfirmPress} stretch size="lg">
          {t('common.confirm')}
        </Button>
      </Box>
    </Modal>
  )
}
