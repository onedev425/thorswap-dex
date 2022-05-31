import { useMemo } from 'react'

import { AssetInputType } from 'components/AssetInput/types'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoWithTooltip } from 'components/InfoWithTooltip'

import { t } from 'services/i18n'

type Params = {
  inputAsset: AssetInputType
  fee?: string
}

export const useApproveInfoItems = ({ inputAsset, fee = 'N/A' }: Params) => {
  const confirmInfoItems: InfoRowConfig[] = useMemo(
    () => [
      {
        label: t('views.liquidity.approve'),
        value: `${inputAsset.value?.toSignificant(
          6,
        )} ${inputAsset.asset.name.toUpperCase()}`,
      },
      {
        label: t('common.transactionFee'),
        value: (
          <InfoWithTooltip tooltip={t('common.transactionFee')} value={fee} />
        ),
      },
    ],
    [fee, inputAsset.asset.name, inputAsset.value],
  )

  return confirmInfoItems
}
