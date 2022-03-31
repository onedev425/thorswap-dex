import { useCallback, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Modal } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { PasswordInput } from 'components/PasswordInput'

import { t } from 'services/i18n'

import { useConfirmInfoItems } from './useConfirmInfoItems'

type Props = {
  isOpen: boolean
  assets: { asset: Asset; value: string }[]
  fees: { chain: string; fee: string }[]
  totalFee: string | null
  poolShare: string | null
  slippage: string | null
  estimatedTime: string
  showPassword?: boolean
  onCancel?: () => void
  onConfirm?: () => void
}

export const ConfirmDepositLiquidity = ({
  isOpen,
  assets,
  fees,
  totalFee = 'N/A',
  estimatedTime,
  poolShare = 'N/A',
  slippage = 'N/A',
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
    poolShare,
    slippage,
    estimatedTime,
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
