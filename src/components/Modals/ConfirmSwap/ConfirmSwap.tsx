import { useCallback, useState } from 'react'

import { AssetInputType } from 'components/AssetInput/types'
import { Box, Button, Modal } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { useConfirmInfoItems } from 'components/Modals/ConfirmSwap/useConfirmInfoItems'
import { PasswordInput } from 'components/PasswordInput'

import { t } from 'services/i18n'

type Props = {
  inputAsset: AssetInputType
  outputAsset: AssetInputType
  recipient: string
  estimatedTime: string
  isOpened: boolean
  showPassword?: boolean
  slippage: string
  minReceive: string
  isValidSlip?: boolean
  totalFee?: string
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmSwap = ({
  inputAsset,
  outputAsset,
  recipient,
  estimatedTime,
  isOpened,
  showPassword = true,
  isValidSlip = true,
  slippage,
  minReceive,
  totalFee,
  onConfirm,
  onClose,
}: Props) => {
  const [password, setPassword] = useState('')
  const handleConfirmPress = useCallback(() => {
    setPassword('')
    onConfirm()
  }, [onConfirm])

  const confirmInfoItems = useConfirmInfoItems({
    inputAsset,
    outputAsset,
    recipient,
    estimatedTime,
    slippage,
    isValidSlip,
    minReceive,
    totalFee,
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
