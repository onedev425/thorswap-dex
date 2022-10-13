import { Asset } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { ReactNode, useMemo } from 'react';
import { t } from 'services/i18n';

type Params = {
  assets: { asset: Asset; value: string }[];
  fee: string;
  ILP: ReactNode;
};

export const useConfirmInfoItems = ({ assets, fee, ILP }: Params) => {
  const confirmInfoItems: InfoRowConfig[] = useMemo(() => {
    const items = assets.map((data) => ({
      label: `${t('common.withdraw')} ${data.asset.ticker} (${data.asset.type})`,
      value: (
        <Box alignCenter justify="between">
          <Typography className="mx-2" fontWeight="semibold">
            {data.value}
          </Typography>
          <AssetIcon asset={data.asset} size={24} />
        </Box>
      ),
    }));

    return items.concat([
      {
        label: t('common.transactionFee'),
        value: <InfoWithTooltip tooltip={t('views.liquidity.gasFeeTooltip')} value={fee} />,
      },
      {
        label: t('views.liquidity.ilp'),
        value: <InfoWithTooltip tooltip={t('views.liquidity.ILPTooltip')} value={ILP} />,
      },
    ]);
  }, [ILP, assets, fee]);

  return confirmInfoItems;
};
