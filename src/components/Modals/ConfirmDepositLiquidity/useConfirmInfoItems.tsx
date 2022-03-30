import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoWithTooltip } from 'components/Modals/ConfirmSwap/InfoWithTooltip'

import { t } from 'services/i18n'

type Params = {
  assets: { asset: Asset; value: string }[]
  fees: { chain: string; fee: string }[]
  totalFee: string | null
  poolShare: string | null
  slippage: string | null
  estimatedTime: string
}

export const useConfirmInfoItems = ({
  assets,
  fees,
  totalFee,
  poolShare,
  slippage,
  estimatedTime,
}: Params) => {
  const assetsInfo = assets.map((data) => ({
    label: `${t('views.liquidity.depositAmount')} ${data.asset.symbol}`,
    value: (
      <Box justify="between" alignCenter>
        <Typography fontWeight="semibold" className="mx-2">
          {data.value}
        </Typography>
        <AssetIcon asset={data.asset} size={24} />
      </Box>
    ),
  }))

  const feesInfo = fees.map((data) => ({
    label: `${data.chain} ${t('common.fee')}`,
    value: (
      <InfoWithTooltip
        tooltip={t('views.liquidity.chainFeeTooltip', {
          chain: data.chain,
        })}
        value={data.fee}
      />
    ),
  }))

  const confirmInfoItems: InfoRowConfig[] = [
    ...assetsInfo,
    {
      label: t('views.wallet.slip'),
      value: (
        <InfoWithTooltip
          tooltip={t('views.wallet.slippageTooltip')}
          value={slippage || 'N/A'}
        />
      ),
    },
    {
      label: t('views.liquidity.poolShareEstimated'),
      value: (
        <InfoWithTooltip
          tooltip={t('views.liquidity.poolShareTooltip')}
          value={`${poolShare}%`}
        />
      ),
    },
    ...feesInfo,
    {
      label: t('views.wallet.totalFee'),
      value: (
        <InfoWithTooltip
          tooltip={t('views.wallet.totalFeeTooltip')}
          value={totalFee || 'N/A'}
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
