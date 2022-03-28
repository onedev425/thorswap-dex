import { shortenAddress } from 'utils/shortenAddress'

import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoWithTooltip } from 'components/Modals/ConfirmSwap/InfoWithTooltip'

import { t } from 'services/i18n'

type Params = {
  address: string
  estimatedTime: string
  fee: string
  receive: { value: string; symbol: string }
  send: { value: string; symbol: string }
  slippage: number
  totalFee?: string
}

export const useConfirmInfoItems = ({
  fee,
  totalFee,
  address,
  send,
  receive,
  slippage,
  estimatedTime,
}: Params) => {
  const confirmInfoItems: InfoRowConfig[] = [
    { label: t('common.send'), value: `${send.value} ${send.symbol}` },
    { label: t('common.receive'), value: `${receive.value} ${receive.symbol}` },
    {
      label: t('common.recipientAddress'),
      value: shortenAddress(address, 6),
      size: 'lg',
    },
    {
      label: t('views.wallet.slip'),
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
          value={`${parseFloat(receive.value) * (1 - slippage / 100)}`}
          tooltip={t('views.wallet.minReceivedTooltip')}
        />
      ),
    },
    {
      label: t('common.transactionFee'),
      value: (
        <InfoWithTooltip
          tooltip={t('views.wallet.transactionFeeTooltip')}
          value={fee}
        />
      ),
    },
    {
      label: t('views.wallet.networkFee'),
      value: (
        <InfoWithTooltip
          tooltip={t('views.wallet.networkFeeTooltip')}
          value={fee}
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
