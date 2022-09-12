import { Asset } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { useMemo } from 'react';
import { t } from 'services/i18n';

type Params = {
  assets: { asset: Asset; value: string }[];
  fee: string;
};

export const useConfirmInfoItems = ({ assets, fee }: Params) => {
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
    ]);
  }, [assets, fee]);

  return confirmInfoItems;
};
