import { Text } from '@chakra-ui/react';
import { Asset } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { t } from 'services/i18n';

type Params = {
  assets: { asset: Asset; value: string }[];
  fees: { chain: string; fee: string }[];
  totalFee: string | null;
  poolShare: string | null;
  slippage: string | null;
  estimatedTime: string;
};

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
      <Box alignCenter justify="between">
        <Text className="mx-2" fontWeight="semibold">
          {data.value}
        </Text>
        <AssetIcon asset={data.asset} size={24} />
      </Box>
    ),
  }));

  const feesInfo = fees.map((data) => ({
    label: `${data.chain === 'THOR' ? 'THORChain' : data.chain} ${t('common.fee')}`,
    value: (
      <InfoWithTooltip
        tooltip={t('views.liquidity.chainFeeTooltip', {
          chain: data.chain === 'THOR' ? 'THORChain' : data.chain,
        })}
        value={data.fee}
      />
    ),
  }));

  const confirmInfoItems: InfoRowConfig[] = [
    ...assetsInfo,
    {
      label: t('views.wallet.slip'),
      value: (
        <InfoWithTooltip tooltip={t('views.wallet.slippageTooltip')} value={slippage || 'N/A'} />
      ),
    },
    {
      label: t('views.liquidity.poolShareEstimated'),
      value: (
        <InfoWithTooltip tooltip={t('views.liquidity.poolShareTooltip')} value={`${poolShare}`} />
      ),
    },
    ...feesInfo,
    {
      label: t('views.wallet.totalFee'),
      value: (
        <InfoWithTooltip tooltip={t('views.wallet.totalFeeTooltip')} value={totalFee || 'N/A'} />
      ),
    },
    {
      label: t('views.wallet.estimatedTime'),
      value: (
        <InfoWithTooltip tooltip={t('views.wallet.estimatedTimeTooltip')} value={estimatedTime} />
      ),
    },
  ];

  return confirmInfoItems;
};
