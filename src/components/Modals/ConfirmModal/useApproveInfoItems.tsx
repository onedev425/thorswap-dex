import { AssetInputType } from 'components/AssetInput/types'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoWithTooltip } from 'components/InfoWithTooltip'

// import { t } from 'services/i18n'

type Params = {
  inputAsset: AssetInputType
  fee?: string
}

export const useApproveInfoItems = ({ inputAsset, fee = 'N/A' }: Params) => {
  const confirmInfoItems: InfoRowConfig[] = [
    {
      label: 'Approve',
      value: `${inputAsset.value?.toSignificant(
        6,
      )} ${inputAsset.asset.name.toUpperCase()}`,
    },
    {
      label: 'Transaction Fee',
      value: <InfoWithTooltip tooltip="Transaction Fee" value={fee} />,
    },
  ]

  return confirmInfoItems
}
