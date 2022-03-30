import { shortenAddress } from 'utils/shortenAddress'

import { AssetInputType } from 'components/AssetInput/types'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoWithTooltip } from 'components/Modals/ConfirmSwap/InfoWithTooltip'

import { t } from 'services/i18n'

type Params = {
  inputAsset: AssetInputType
  outputAsset: AssetInputType
  recipient: string
  estimatedTime: string
  slippage: string
  isValidSlip?: boolean
  minReceive: string
  totalFee?: string
}

export const useConfirmInfoItems = ({
  inputAsset,
  outputAsset,
  recipient,
  estimatedTime,
  slippage,
  minReceive,
  totalFee,
}: Params) => {
  const confirmInfoItems: InfoRowConfig[] = [
    {
      label: t('common.send'),
      value: `${inputAsset.value?.toSignificant(
        6,
      )} ${inputAsset.asset.name.toUpperCase()}`,
    },
    {
      label: t('common.receive'),

      value: `${outputAsset.value?.toSignificant(
        6,
      )} ${outputAsset.asset.name.toUpperCase()}`,
    },
    {
      label: t('common.recipientAddress'),
      value: shortenAddress(recipient, 6),
      size: 'lg',
    },
    {
      label: t('views.wallet.slip'),
      // TODO: warning color for invalid slippage
      value: (
        <InfoWithTooltip
          value={`${slippage}`}
          tooltip={t('views.wallet.slippageTooltip')}
        />
      ),
    },
    {
      label: t('views.wallet.minReceived'),
      value: (
        <InfoWithTooltip
          value={minReceive}
          tooltip={t('views.wallet.minReceivedTooltip')}
        />
      ),
    },
    {
      label: t('views.wallet.totalFee'),
      value: (
        <InfoWithTooltip
          tooltip={t('views.wallet.totalFeeTooltip')}
          value={`${totalFee}`}
        />
      ),
    },
    {
      label: t('views.wallet.estimatedTime'),
      value: (
        <InfoWithTooltip
          tooltip={t('views.wallet.estimatedTimeTooltip')}
          value={estimatedTime}
        />
      ),
    },
  ]

  return confirmInfoItems
}
