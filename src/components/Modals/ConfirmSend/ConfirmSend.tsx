import { useCallback, useMemo, useState } from 'react'

import { AssetInputType } from 'components/AssetInput/types'
import {
  Box,
  Button,
  Icon,
  Modal,
  Tooltip,
  Typography,
} from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { PasswordInput } from 'components/PasswordInput'

import { t } from 'services/i18n'

type Props = {
  isOpened: boolean
  onClose: () => void
  onConfirm: () => void
  address: string
  asset: AssetInputType
  showPassword?: boolean
}

export const ConfirmSend = ({
  isOpened,
  address,
  asset,
  showPassword = true,
  onConfirm,
  onClose,
}: Props) => {
  const [password, setPassword] = useState('')

  const handleConfirmPress = useCallback(() => {
    setPassword('')
    onConfirm()
  }, [onConfirm])

  const summary = useMemo(
    () => [
      {
        label: t('common.send'),
        value: `${asset.value} ${asset.asset}`,
      },
      { label: t('common.recipient'), value: address },
      {
        label: t('common.transactionFee'),
        value: (
          <Box className="gap-2" center>
            <Typography variant="caption">0.00675 ETH ($20)</Typography>
            <Tooltip content={t('views.send.txFeeTooltip')}>
              <Icon size={20} color="secondary" name="infoCircle" />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [address, asset.asset, asset.value],
  )

  return (
    <Modal title={t('common.confirm')} isOpened={isOpened} onClose={onClose}>
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
