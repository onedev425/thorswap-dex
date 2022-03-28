import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoWithTooltip } from 'components/Modals/ConfirmSwap/InfoWithTooltip'

import { t } from 'services/i18n'

type Params = {
  assets: { asset: Asset; value: string }[]
  fee: string
}

export const useConfirmInfoItems = ({ assets, fee }: Params) => {
  const confirmInfoItems: InfoRowConfig[] = []

  assets.map((data) =>
    confirmInfoItems.push({
      label: `${t('common.withdraw')} ${data.asset.symbol}`,
      value: (
        <Box justify="between" alignCenter>
          <Typography fontWeight="semibold" className="mx-2">
            {data.value}
          </Typography>
          <AssetIcon asset={data.asset} size={24} />
        </Box>
      ),
    }),
  )

  confirmInfoItems.push({
    label: t('common.transactionFee'),
    value: (
      <InfoWithTooltip
        tooltip={t('views.liquidity.gasFeeTooltip')}
        value={fee}
      />
    ),
  })

  return confirmInfoItems
}
