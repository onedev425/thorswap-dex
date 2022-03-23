import { useMemo } from 'react'

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

import { t } from 'services/i18n'

type Props = {
  isOpened: boolean
  onClose: () => void
  onConfirm: () => void
  address: string
  asset: AssetInputType
}

export const SendConfirm = ({
  isOpened,
  address,
  asset,
  onConfirm,
  onClose,
}: Props) => {
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
            <Tooltip content="Transaction fee tooltip">
              <Icon size={20} color="secondary" name="infoCircle" />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [address, asset.asset, asset.value],
  )

  return (
    <Modal title="Confirm" isOpened={isOpened} onClose={onClose}>
      <Box className="!w-[350px]" col>
        <InfoTable items={summary} />
        <Button stretch className="mt-8" onClick={onConfirm}>
          {t('common.confirm')}
        </Button>
      </Box>
    </Modal>
  )
}
