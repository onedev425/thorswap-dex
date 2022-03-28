import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoWithTooltip } from 'components/Modals/ConfirmSwap/InfoWithTooltip'

import { t } from 'services/i18n'

type Params = {
  assets: { asset: Asset; value: string }[]
  fees: { chain: string; fee: string }[]
  totalFee: string
  poolShare: number
  slippage: number
  estimatedTime: string
}

export const useConfirmInfoItems = ({
  assets,
  fees,
  totalFee,
  estimatedTime,
  poolShare,
  slippage,
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
          value={`${slippage}%`}
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
          value={totalFee}
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
