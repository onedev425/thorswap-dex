import { Text } from '@chakra-ui/react';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { ReactNode, useMemo } from 'react';
import { t } from 'services/i18n';

type Params = {
  assets: { asset: AssetEntity; value: string }[];
  fee: string;
  ILP: ReactNode;
};

export const useConfirmInfoItems = ({ assets, fee, ILP }: Params) => {
  const confirmInfoItems: InfoRowConfig[] = useMemo(() => {
    const items = assets.map((data) => ({
      label: `${t('common.withdraw')} ${data.asset.ticker} (${data.asset.type})`,
      value: (
        <Box alignCenter justify="between">
          <Text className="mx-2" fontWeight="semibold">
            {data.value}
          </Text>
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
