import { useCallback, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Modal } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { useConfirmInfoItems } from 'components/Modals/ConfirmWithdrawLiquidity/useConfirmInfoItems'
import { PasswordInput } from 'components/PasswordInput'

import { t } from 'services/i18n'

type Props = {
  isOpen: boolean
  onCancel?: () => void
  onConfirm?: () => void
  assets: { asset: Asset; value: string }[]
  fee: string
  showPassword?: boolean
}

export const ConfirmWithdrawLiquidity = ({
  isOpen,
  assets,
  fee,
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
    fee,
  })

  return (
    <Modal
      title={t('views.liquidity.confirmWithdraw')}
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
