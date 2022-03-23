import { AssetInputType } from 'components/AssetInput/types'
import {
  Box,
  Button,
  Icon,
  Modal,
  Tooltip,
  Typography,
} from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'

import { t } from 'services/i18n'

type Props = {
  isOpened: boolean
  onClose: () => void
  onConfirm: () => void
  address: string
  asset: AssetInputType
}

export const SwapConfirm = ({
  isOpened,
  address,
  asset,
  onConfirm,
  onClose,
}: Props) => {
  return (
    <Modal title="Confirm" isOpened={isOpened} onClose={onClose}>
      <div className="my-3">
        <Box className="gap-2" col>
          <InfoRow
            className="flex-1"
            label="Send"
            value={`${asset.value} ${asset.asset}`}
          />

          <InfoRow className="flex-1" label="Recipient" value={address} />

          <InfoRow
            className="flex-1"
            label={t('common.transactionFee')}
            value={
              <Box className="gap-2" center>
                <Typography variant="caption">0.00675 ETH ($20)</Typography>
                <Tooltip content="Transaction fee tooltip">
                  <Icon size={20} color="secondary" name="infoCircle" />
                </Tooltip>
              </Box>
            }
          />

          <Button className="px-32 mx-4 mt-8" onClick={onConfirm}>
            {t('common.confirm')}
          </Button>
        </Box>
      </div>
    </Modal>
  )
}
