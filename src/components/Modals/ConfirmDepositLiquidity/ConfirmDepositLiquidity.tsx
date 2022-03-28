import { useCallback, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Modal } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { useConfirmInfoItems } from 'components/Modals/ConfirmDepositLiquidity/useConfirmInfoItems'
import { PasswordInput } from 'components/PasswordInput'

import { t } from 'services/i18n'

type Props = {
  isOpen: boolean
  assets: { asset: Asset; value: string }[]
  fees: { chain: string; fee: string }[]
  totalFee: string
  poolShare: number
  slippage: number
  estimatedTime: string
  showPassword?: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

export const ConfirmDepositLiquidity = ({
  isOpen,
  assets,
  fees,
  totalFee,
  estimatedTime,
  poolShare,
  slippage,
  showPassword = true,
  onConfirm,
  onCancel = () => {},
}: Props) => {
  const [password, setPassword] = useState('')

  const handleConfirmPress = useCallback(() => {
    setPassword('')
    onConfirm?.()
  }, [onConfirm])

  const summary = useConfirmInfoItems({
    assets,
    fees,
    totalFee,
    estimatedTime,
    poolShare,
    slippage,
  })

  return (
    <Modal
      title={t('views.liquidity.confirmDeposit')}
      isOpened={isOpen}
      onClose={onCancel}
    >
      <Box className="gap-y-4 md:gap-y-8 md:!min-w-[350px]" col>
        <InfoTable items={summary} />

        {showPassword && (
          <PasswordInput
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        )}

        <Button stretch onClick={handleConfirmPress}>
          {t('common.confirm')}
        </Button>
      </Box>
    </Modal>
  )
}
